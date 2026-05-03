import type { NextApiRequest, NextApiResponse } from "next";
import { callGemini, extractJson } from "@/lib/geminiClient";

export interface PackageAnalysisRequest {
  boxId: string;
  gForcePeak: number;
  gForceHistory: number[];
  battery: number;
  signalStrength: number;
  temperature?: number;
  humidity?: number;
  location: string;
  routeName: string;
  timestamp: string;
}

export interface PackageAnalysisResult {
  status: "SAFE" | "AT_RISK" | "DAMAGED" | "CRITICAL";
  riskScore: number;
  title: string;
  summary: string;
  details: string;
  recommendations: string[];
  confidence: number;
  /** True when AI is unavailable (rate limit, etc.) and we used a rule-based fallback. */
  fallback?: boolean;
}

/**
 * Deterministic rule-based analyzer. Used as a graceful fallback when Gemini
 * is rate-limited or unreachable, so the dashboard still produces useful output.
 */
function ruleBasedAnalysis(data: PackageAnalysisRequest): PackageAnalysisResult {
  const { gForcePeak, battery, signalStrength } = data;

  let status: PackageAnalysisResult["status"] = "SAFE";
  let riskScore = 0;

  if (gForcePeak > 8 && (battery < 40 || signalStrength < 40)) {
    status = "CRITICAL";
    riskScore = 90;
  } else if (gForcePeak > 6 || battery < 40) {
    status = "DAMAGED";
    riskScore = 75;
  } else if (gForcePeak > 3 || battery < 70 || signalStrength < 60) {
    status = "AT_RISK";
    riskScore = 50;
  } else {
    status = "SAFE";
    riskScore = 15;
  }

  const titleMap = {
    SAFE: "Paket Aman",
    AT_RISK: "Perlu Perhatian",
    DAMAGED: "Indikasi Kerusakan",
    CRITICAL: "Kondisi Kritis",
  };

  const recsMap: Record<PackageAnalysisResult["status"], string[]> = {
    SAFE: [
      "Lanjutkan pengiriman seperti biasa",
      "Pantau sensor secara berkala",
    ],
    AT_RISK: [
      "Periksa kemasan paket di pos berikutnya",
      "Tingkatkan frekuensi monitoring sensor",
    ],
    DAMAGED: [
      "Hentikan pengiriman dan inspeksi fisik paket",
      "Dokumentasikan kerusakan untuk klaim asuransi",
    ],
    CRITICAL: [
      "Hentikan pengiriman segera",
      "Aktifkan protokol darurat & klaim escrow",
      "Hubungi tim handling untuk evakuasi paket",
    ],
  };

  return {
    status,
    riskScore,
    title: titleMap[status],
    summary: `${data.boxId} di ${data.location}: G-Force puncak ${gForcePeak}G, baterai ${battery}%, sinyal ${signalStrength}%.`,
    details: `Analisa rule-based: G-Force puncak ${gForcePeak}G (ambang bahaya >7G), baterai ${battery}% (kritis <40%), sinyal ${signalStrength}% (lemah <40%). Status ditentukan dari ambang sensor IoT standar SafeTrack.`,
    recommendations: recsMap[status],
    confidence: 70,
    fallback: true,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PackageAnalysisResult | { error: string; code?: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const data: PackageAnalysisRequest = req.body;

  const prompt = `You are an expert logistics AI system analyzing IoT sensor data from a shipping package.

Analyze the following sensor data and determine the package condition:

Package ID: ${data.boxId}
Route: ${data.routeName}
Location: ${data.location}
Timestamp: ${data.timestamp}

Sensor Readings:
- G-Force Peak: ${data.gForcePeak}G (DANGER threshold: >7G, WARNING: >4G)
- G-Force History (last readings): ${data.gForceHistory.join(", ")}G
- Battery Level: ${data.battery}%
- Signal Strength: ${data.signalStrength}%
${data.temperature ? `- Temperature: ${data.temperature}°C` : ""}
${data.humidity ? `- Humidity: ${data.humidity}%` : ""}

Respond ONLY with valid JSON in this exact format (no markdown, no explanation outside JSON):
{
  "status": "SAFE" | "AT_RISK" | "DAMAGED" | "CRITICAL",
  "riskScore": <number 0-100>,
  "title": "<short status title in Indonesian>",
  "summary": "<1 sentence summary in Indonesian>",
  "details": "<detailed analysis 2-3 sentences in Indonesian explaining what happened to the package>",
  "recommendations": ["<action 1 in Indonesian>", "<action 2 in Indonesian>"],
  "confidence": <number 0-100>
}

Rules for status:
- SAFE: gForcePeak < 3G, battery > 70%, signal > 60%
- AT_RISK: gForcePeak 3-6G OR battery 40-70% OR signal 40-60%
- DAMAGED: gForcePeak 6-8G OR battery < 40%
- CRITICAL: gForcePeak > 8G AND (battery < 40% OR signal < 40%)`;

  const result = await callGemini(prompt);

  if (result.ok) {
    const parsed = extractJson<PackageAnalysisResult>(result.text, "object");
    if (parsed) {
      return res.status(200).json({ ...parsed, fallback: false });
    }
    console.warn("Gemini returned non-JSON text, using fallback.");
    return res.status(200).json(ruleBasedAnalysis(data));
  }

  const err = result.error!;
  console.error(`Gemini analyze-package failed [${err.code}]:`, err.message);

  // Always return a rule-based analysis so the dashboard stays functional, even when
  // the API key is missing/invalid (e.g. on Vercel before env vars are configured).
  // The `fallback: true` flag tells the UI to show a "Rule-based" badge.
  if (
    err.code === "RATE_LIMITED" ||
    err.code === "UNKNOWN" ||
    err.code === "MISSING_KEY" ||
    err.code === "INVALID_KEY"
  ) {
    return res.status(200).json(ruleBasedAnalysis(data));
  }

  return res.status(err.status).json({ error: err.message, code: err.code });
}
