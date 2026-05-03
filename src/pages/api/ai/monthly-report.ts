import type { NextApiRequest, NextApiResponse } from "next";
import { callGemini, extractJson } from "@/lib/geminiClient";

export interface MonthlyStats {
  month: string;
  year: number;
  totalPackages: number;
  delivered: number;
  inTransit: number;
  incidents: number;
  criticalIncidents: number;
  avgGForce: number;
  maxGForce: number;
  avgBattery: number;
  avgSignal: number;
  topRoutes: { route: string; count: number; incidents: number }[];
  damagedPackages: number;
}

export interface MonthlyReportResult {
  reportTitle: string;
  executiveSummary: string;
  performanceAnalysis: string;
  riskAssessment: string;
  routeAnalysis: string;
  recommendations: string[];
  outlook: string;
  overallScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  fallback?: boolean;
}

function fallbackReport(stats: MonthlyStats): MonthlyReportResult {
  const deliveryRate = (stats.delivered / stats.totalPackages) * 100;
  const incidentRate = (stats.incidents / stats.totalPackages) * 100;

  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(deliveryRate * 0.6 + (100 - incidentRate * 5) * 0.4)
    )
  );
  const grade: MonthlyReportResult["grade"] =
    score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";

  const worstRoute = [...stats.topRoutes].sort(
    (a, b) => b.incidents / b.count - a.incidents / a.count
  )[0];
  const bestRoute = [...stats.topRoutes].sort(
    (a, b) => a.incidents / a.count - b.incidents / b.count
  )[0];

  return {
    reportTitle: `Laporan Performa SafeTrack ${stats.month} ${stats.year}`,
    executiveSummary: `Pada ${stats.month} ${stats.year}, SafeTrack memproses ${stats.totalPackages} paket dengan tingkat keberhasilan pengiriman ${deliveryRate.toFixed(1)}%. Tercatat ${stats.incidents} insiden (${incidentRate.toFixed(1)}%) di mana ${stats.criticalIncidents} di antaranya tergolong kritis.`,
    performanceAnalysis: `Total ${stats.delivered} paket berhasil terkirim dari ${stats.totalPackages} paket, dengan ${stats.inTransit} paket masih dalam perjalanan. Rata-rata baterai armada ${stats.avgBattery}% dan kekuatan sinyal ${stats.avgSignal}%, menunjukkan kondisi infrastruktur IoT yang ${stats.avgBattery > 70 ? "sehat" : "perlu peremajaan"}. Performa keseluruhan berada pada level ${grade}.`,
    riskAssessment: `G-Force rata-rata bulan ini ${stats.avgGForce}G dengan puncak ${stats.maxGForce}G. ${stats.criticalIncidents > 0 ? `Tercatat ${stats.criticalIncidents} insiden kritis yang memerlukan investigasi handling lebih lanjut.` : "Tidak ada insiden kritis yang tercatat."} Tingkat insiden ${incidentRate.toFixed(1)}% ${incidentRate > 10 ? "berada di atas ambang aman dan perlu perhatian khusus" : "masih dalam batas operasional yang dapat diterima"}.`,
    routeAnalysis: `Rute terbaik: ${bestRoute?.route ?? "—"} dengan ${bestRoute?.incidents ?? 0} insiden dari ${bestRoute?.count ?? 0} paket. Rute dengan risiko tertinggi: ${worstRoute?.route ?? "—"} mencatat ${worstRoute?.incidents ?? 0} insiden dari ${worstRoute?.count ?? 0} paket. Disarankan evaluasi protokol handling pada rute berisiko tinggi.`,
    recommendations: [
      stats.avgBattery < 70
        ? "Lakukan penggantian baterai sensor pada armada yang berada di bawah 70%"
        : "Pertahankan jadwal preventive maintenance baterai sensor",
      stats.maxGForce > 8
        ? "Tinjau ulang kemasan dan handling pada rute dengan G-Force puncak >8G"
        : "Standarisasi praktik kemasan saat ini terbukti efektif",
      stats.avgSignal < 70
        ? "Tingkatkan coverage 0G Network di area sinyal lemah"
        : "Lanjutkan monitoring real-time data integrity 0G Network",
      "Aktifkan protokol klaim escrow otomatis untuk semua paket dengan status DAMAGED/CRITICAL",
    ],
    outlook: `Dengan tren saat ini, performa bulan depan diproyeksikan ${score >= 80 ? "stabil pada level baik" : score >= 60 ? "membaik jika rekomendasi dijalankan" : "memerlukan intervensi segera untuk menghindari penurunan lebih lanjut"}.`,
    overallScore: score,
    grade,
    fallback: true,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MonthlyReportResult | { error: string; code?: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stats: MonthlyStats = req.body;
  const deliveryRate = ((stats.delivered / stats.totalPackages) * 100).toFixed(1);
  const incidentRate = ((stats.incidents / stats.totalPackages) * 100).toFixed(1);

  const prompt = `You are a senior logistics analyst AI for SafeTrack DePIN, an IoT-based package tracking system. Generate a comprehensive monthly performance report.

Data for ${stats.month} ${stats.year}:

SHIPMENT METRICS:
- Total Packages: ${stats.totalPackages}
- Successfully Delivered: ${stats.delivered} (${deliveryRate}%)
- In Transit: ${stats.inTransit}
- Total Incidents: ${stats.incidents} (${incidentRate}% incident rate)
- Critical Incidents: ${stats.criticalIncidents}
- Damaged Packages: ${stats.damagedPackages}

SENSOR DATA AVERAGES:
- Average G-Force: ${stats.avgGForce}G
- Maximum G-Force Recorded: ${stats.maxGForce}G
- Average Battery Level: ${stats.avgBattery}%
- Average Signal Strength: ${stats.avgSignal}%

TOP ROUTES:
${stats.topRoutes.map((r) => `- ${r.route}: ${r.count} packages, ${r.incidents} incidents`).join("\n")}

Generate a professional monthly report in Indonesian. Respond ONLY with valid JSON (no markdown):
{
  "reportTitle": "<judul laporan>",
  "executiveSummary": "<ringkasan eksekutif 2-3 kalimat>",
  "performanceAnalysis": "<analisis performa pengiriman 3-4 kalimat>",
  "riskAssessment": "<penilaian risiko dan insiden 2-3 kalimat>",
  "routeAnalysis": "<analisis rute terbaik dan terburuk 2-3 kalimat>",
  "recommendations": ["<rekomendasi 1>", "<rekomendasi 2>", "<rekomendasi 3>", "<rekomendasi 4>"],
  "outlook": "<proyeksi bulan depan 1-2 kalimat>",
  "overallScore": <score 0-100 based on delivery rate, incident rate, sensor readings>,
  "grade": "A" | "B" | "C" | "D" | "F"
}`;

  const result = await callGemini(prompt);

  if (result.ok) {
    const parsed = extractJson<MonthlyReportResult>(result.text, "object");
    if (parsed) {
      return res.status(200).json({ ...parsed, fallback: false });
    }
    console.warn("Gemini monthly-report returned non-JSON, using fallback.");
    return res.status(200).json(fallbackReport(stats));
  }

  const err = result.error!;
  console.error(`Gemini monthly-report failed [${err.code}]:`, err.message);

  if (err.code === "RATE_LIMITED" || err.code === "UNKNOWN") {
    return res.status(200).json(fallbackReport(stats));
  }
  return res.status(err.status).json({ error: err.message, code: err.code });
}
