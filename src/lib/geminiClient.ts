import { GoogleGenAI } from "@google/genai";

export const GEMINI_MODEL_PRIMARY = "gemini-2.5-flash";
export const GEMINI_MODEL_FALLBACK = "gemini-2.5-flash-lite";

export interface GeminiCallResult {
  ok: boolean;
  text: string;
  error?: {
    status: number;
    code: "RATE_LIMITED" | "MISSING_KEY" | "INVALID_KEY" | "UNKNOWN";
    message: string;
    retryAfterMs?: number;
  };
}

interface GeminiApiError {
  status?: number;
  message?: string;
  error?: { code?: number; message?: string; status?: string };
}

function parseRetryDelay(message: string): number | undefined {
  const match = message.match(/retry in ([0-9.]+)s/i);
  if (match) return Math.ceil(parseFloat(match[1]) * 1000);
  return undefined;
}

function classifyError(err: unknown): GeminiCallResult["error"] {
  const e = err as GeminiApiError;
  const raw = typeof e?.message === "string" ? e.message : JSON.stringify(e);
  const status =
    e?.status ?? e?.error?.code ?? (raw.includes('"code":429') ? 429 : 0);

  if (status === 429 || /RESOURCE_EXHAUSTED|quota/i.test(raw)) {
    return {
      status: 429,
      code: "RATE_LIMITED",
      message:
        "Kuota Gemini API tercapai. Silakan tunggu sebentar atau gunakan model lain.",
      retryAfterMs: parseRetryDelay(raw),
    };
  }
  if (status === 400 && /API key/i.test(raw)) {
    return {
      status: 400,
      code: "INVALID_KEY",
      message: "GEMINI_API_KEY tidak valid. Periksa kembali di .env.local.",
    };
  }
  if (status === 401 || status === 403) {
    return {
      status,
      code: "INVALID_KEY",
      message:
        "GEMINI_API_KEY ditolak (permission denied). Buat API key baru di https://aistudio.google.com/app/apikey",
    };
  }
  return {
    status: status || 500,
    code: "UNKNOWN",
    message:
      e?.error?.message ?? e?.message ?? "Gagal memanggil Gemini API.",
  };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Call Gemini with automatic retry, model fallback, and structured error reporting.
 *
 * Retry strategy:
 *  - 429 RESOURCE_EXHAUSTED on primary model → switch to fallback model immediately
 *    (different quota pool), then exponential backoff if still rate-limited.
 *  - Other transient errors → 1 quick retry.
 */
export async function callGemini(prompt: string): Promise<GeminiCallResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return {
      ok: false,
      text: "",
      error: {
        status: 500,
        code: "MISSING_KEY",
        message:
          "GEMINI_API_KEY belum dikonfigurasi. Tambahkan di file .env.local lalu restart server.",
      },
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  const models = [GEMINI_MODEL_PRIMARY, GEMINI_MODEL_FALLBACK];
  let lastError: GeminiCallResult["error"];

  for (let i = 0; i < models.length; i++) {
    const model = models[i];

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            // gemini-2.5-flash has reasoning ("thinking") enabled by default which
            // adds 5-10s latency. We don't need it for structured JSON tasks.
            thinkingConfig: { thinkingBudget: 0 },
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        });
        const text = response.text?.trim() ?? "";
        if (!text) throw new Error("Empty response from Gemini");
        return { ok: true, text };
      } catch (err) {
        const classified = classifyError(err);
        lastError = classified;

        if (classified.code === "RATE_LIMITED") {
          // Try the fallback model immediately (different quota pool).
          if (i < models.length - 1) break;
          // On the last model, wait briefly then retry once if retryAfter is short.
          const wait = Math.min(classified.retryAfterMs ?? 1500, 4000);
          if (attempt === 0 && wait <= 4000) {
            await sleep(wait);
            continue;
          }
        }
        // Non-rate-limit errors: do not switch models, fail fast.
        return { ok: false, text: "", error: classified };
      }
    }
  }

  return {
    ok: false,
    text: "",
    error: lastError ?? {
      status: 500,
      code: "UNKNOWN",
      message: "Gagal memanggil Gemini API.",
    },
  };
}

/** Extract a JSON object or array from a possibly-markdown-wrapped Gemini response. */
export function extractJson<T>(text: string, mode: "object" | "array" = "object"): T | null {
  const cleaned = text.replace(/```json?|```/g, "").trim();
  const pattern = mode === "array" ? /\[[\s\S]*\]/ : /\{[\s\S]*\}/;
  const match = cleaned.match(pattern);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as T;
  } catch {
    return null;
  }
}
