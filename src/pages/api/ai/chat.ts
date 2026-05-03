import type { NextApiRequest, NextApiResponse } from "next";
import { callGemini, extractJson } from "@/lib/geminiClient";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
  navigateTo?: string;
}

const SYSTEM_CONTEXT = `Kamu adalah SafeTrack AI Assistant, asisten cerdas untuk dashboard logistik SafeTrack DePIN.

Dashboard SafeTrack memiliki halaman-halaman berikut (gunakan navigateTo untuk mengarahkan user):
- "overview" → Ringkasan dashboard, metrik utama, status pengiriman, grafik G-Force
- "shipments" → Daftar pengiriman aktif, peta lokasi, detail paket
- "sensors" → Manajemen sensor IoT, status node sensor
- "lifecycle" → Siklus hidup perangkat, manajemen depot, kesehatan baterai
- "thresholds" → Konfigurasi batas G-Force
- "integrity" → Verifikasi integritas data blockchain 0G Network
- "incidents" → Laporan insiden, paket bermasalah
- "predictions" → Prediksi AI dan analisa risiko pengiriman
- "route-tracking" → Tracking paket per jalur pengiriman dengan analisa Gemini AI
- "monthly-report" → Laporan bulanan yang dianalisa AI, statistik performa
- "claims" → Klaim & escrow smart contract
- "settings" → Pengaturan API keys, konfigurasi sistem

Data sistem (dummy/demo):
- Total paket aktif: 19 paket di 5 rute
- Rute aktif: Hamburg→Rotterdam, Shanghai→Tokyo, Dubai→Mumbai, New York→Chicago, São Paulo→Buenos Aires
- 3 paket status CRITICAL, 4 paket WARNING
- G-Force tertinggi: 9.2G (BOX-DB02, Dubai)
- Jaringan 0G: Connected

Instruksi perilaku:
- Jawab SELALU dalam Bahasa Indonesia yang natural dan profesional
- Jika user bertanya tentang halaman/fitur tertentu, sertakan navigateTo dalam respons JSON
- Jika user bertanya tentang data, berikan info berdasarkan konteks di atas
- Berikan saran yang actionable
- Jawaban singkat dan jelas, maksimal 3-4 kalimat
- Jika user menyebut kata kunci tertentu, arahkan ke halaman yang relevan

Format respons HARUS berupa JSON valid:
{"reply": "<jawaban dalam bahasa Indonesia>", "navigateTo": "<section_id atau null>"}

Contoh navigateTo values: "overview", "shipments", "route-tracking", "monthly-report", "incidents", "integrity", "predictions", "sensors", "lifecycle", "thresholds", "claims", "settings"`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse | { error: string; code?: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history }: ChatRequest = req.body;

  const historyText = history
    .slice(-6)
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const prompt = `${SYSTEM_CONTEXT}

Riwayat percakapan terakhir:
${historyText || "(tidak ada riwayat)"}

User sekarang bertanya: "${message}"

Balas HANYA dengan JSON valid tanpa markdown:`;

  const result = await callGemini(prompt);

  if (result.ok) {
    const parsed = extractJson<ChatResponse>(result.text, "object");
    if (!parsed) {
      return res
        .status(200)
        .json({ reply: result.text.replace(/```json?|```/g, "").trim() });
    }
    if (!parsed.navigateTo || parsed.navigateTo === "null") {
      parsed.navigateTo = undefined;
    }
    return res.status(200).json(parsed);
  }

  const err = result.error!;
  console.error(`Gemini chat failed [${err.code}]:`, err.message);
  return res.status(err.status).json({ error: err.message, code: err.code });
}
