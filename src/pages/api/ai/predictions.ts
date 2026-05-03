import type { NextApiRequest, NextApiResponse } from "next";
import { callGemini, extractJson } from "@/lib/geminiClient";
import { shipmentData } from "@/data/mockData";

export interface Prediction {
  title: string;
  confidence: number;
  trend: "up" | "down" | "neutral";
  summary: string;
  breakdown: string;
  status: "safe" | "warning" | "danger";
}

/**
 * Deterministic fallback predictions derived from shipment statistics, used when
 * Gemini API is rate-limited so the dashboard remains functional.
 */
function fallbackPredictions(): Prediction[] {
  const total = shipmentData.length;
  const critical = shipmentData.filter((s) => s.gForcePeak > 7).length;
  const warning = shipmentData.filter((s) => s.gForcePeak > 4 && s.gForcePeak <= 7).length;
  const lowBattery = shipmentData.filter((s) => s.battery < 50).length;
  const avgG = shipmentData.reduce((a, b) => a + b.gForcePeak, 0) / total;
  const avgDamage = shipmentData.reduce((a, b) => a + b.aiDamageLikelihood, 0) / total;
  const lowSignal = shipmentData.filter((s) => s.signalStrength < 50).length;

  return [
    {
      title: "Route Risk Assessment",
      confidence: 78,
      trend: critical > 2 ? "up" : "down",
      summary:
        critical > 2
          ? `Terdapat ${critical} paket dengan G-Force kritis (>7G). Pertimbangkan re-routing untuk mengurangi guncangan jalan.`
          : `Mayoritas rute berjalan normal. Hanya ${critical} paket dalam status kritis.`,
      breakdown: `Avg G: ${avgG.toFixed(1)}G | Critical: ${critical}/${total}`,
      status: critical > 2 ? "danger" : critical > 0 ? "warning" : "safe",
    },
    {
      title: "Battery Depletion Risk",
      confidence: 82,
      trend: lowBattery > 3 ? "up" : "down",
      summary:
        lowBattery > 3
          ? `${lowBattery} paket dengan baterai di bawah 50%. Risiko kehilangan tracking dalam 24 jam ke depan.`
          : `Status baterai armada relatif sehat. ${lowBattery} paket perlu pengisian ulang.`,
      breakdown: `Low battery: ${lowBattery}/${total}`,
      status: lowBattery > 4 ? "danger" : lowBattery > 2 ? "warning" : "safe",
    },
    {
      title: "Damage Probability",
      confidence: 74,
      trend: avgDamage > 50 ? "up" : "neutral",
      summary: `Rata-rata kemungkinan kerusakan armada ${avgDamage.toFixed(1)}%. ${
        avgDamage > 50 ? "Perlu evaluasi handling di pos transit." : "Indikator kerusakan dalam batas wajar."
      }`,
      breakdown: `Avg damage: ${avgDamage.toFixed(1)}% | Warning: ${warning}`,
      status: avgDamage > 60 ? "danger" : avgDamage > 35 ? "warning" : "safe",
    },
    {
      title: "Network Signal Health",
      confidence: 80,
      trend: lowSignal > 3 ? "up" : "down",
      summary:
        lowSignal > 3
          ? `${lowSignal} paket dengan sinyal lemah. Risiko data integrity gap pada 0G Network.`
          : `Konektivitas 0G Network stabil. ${lowSignal} paket dalam zona sinyal lemah.`,
      breakdown: `Weak signal: ${lowSignal}/${total}`,
      status: lowSignal > 4 ? "danger" : lowSignal > 2 ? "warning" : "safe",
    },
  ];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Prediction[] | { error: string; code?: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const summary = shipmentData.map((s) => ({
    id: s.boxId,
    gForce: s.gForcePeak,
    damage: s.aiDamageLikelihood,
    status: s.status,
    battery: s.battery,
    signal: s.signalStrength,
    location: s.location,
  }));

  const criticalCount = shipmentData.filter((s) => s.gForcePeak > 7).length;
  const warningCount = shipmentData.filter((s) => s.gForcePeak > 4 && s.gForcePeak <= 7).length;
  const lowBattery = shipmentData.filter((s) => s.battery < 50).length;
  const avgDamage = (
    shipmentData.reduce((a, b) => a + b.aiDamageLikelihood, 0) /
    shipmentData.length
  ).toFixed(1);

  const prompt = `You are an AI logistics analyst for SafeTrack DePIN. Analyze this IoT shipment fleet data and generate 4 actionable predictions.

Fleet Data (${shipmentData.length} packages):
${JSON.stringify(summary, null, 2)}

Statistics:
- Critical packages (G>7G): ${criticalCount}
- Warning packages (G 4-7G): ${warningCount}
- Low battery (<50%): ${lowBattery}
- Avg damage likelihood: ${avgDamage}%

Generate exactly 4 predictions. Respond ONLY with a JSON array (no markdown):
[
  {
    "title": "<prediction title in English>",
    "confidence": <50-98>,
    "trend": "up" | "down" | "neutral",
    "summary": "<1-2 sentences in Indonesian>",
    "breakdown": "<key metric like 'Avg G: 4.2G | Risk: 38%'>",
    "status": "safe" | "warning" | "danger"
  }
]

Cover: route optimization, battery risk, damage probability, environmental factors.`;

  const result = await callGemini(prompt);

  if (result.ok) {
    const parsed = extractJson<Prediction[]>(result.text, "array");
    if (parsed && Array.isArray(parsed) && parsed.length > 0) {
      return res.status(200).json(parsed);
    }
    console.warn("Gemini predictions returned non-JSON, using fallback.");
    return res.status(200).json(fallbackPredictions());
  }

  const err = result.error!;
  console.error(`Gemini predictions failed [${err.code}]:`, err.message);

  if (err.code === "RATE_LIMITED" || err.code === "UNKNOWN") {
    return res.status(200).json(fallbackPredictions());
  }
  return res.status(err.status).json({ error: err.message, code: err.code });
}
