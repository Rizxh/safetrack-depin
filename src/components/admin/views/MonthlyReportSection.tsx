"use client";

import { useState } from "react";
import {
  FileText,
  Brain,
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Download,
  ChevronDown,
  BarChart2,
  Star,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { monthlyStatsData } from "@/data/routeData";
import type { MonthlyReportResult } from "@/pages/api/ai/monthly-report";

const gradeColor: Record<string, string> = {
  A: "text-green-400",
  B: "text-teal-400",
  C: "text-yellow-400",
  D: "text-orange-400",
  F: "text-red-400",
};

const gradeGlow: Record<string, string> = {
  A: "shadow-green-500/20",
  B: "shadow-teal-500/20",
  C: "shadow-yellow-500/20",
  D: "shadow-orange-500/20",
  F: "shadow-red-500/20",
};

function StatCard({
  label,
  value,
  sub,
  trend,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-secondary">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        {TrendIcon && (
          <TrendIcon className={`h-4 w-4 ${trend === "up" ? "text-green-400" : "text-red-400"}`} />
        )}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

export function MonthlyReportSection() {
  const [selectedIdx, setSelectedIdx] = useState(monthlyStatsData.length - 1);
  const [report, setReport] = useState<MonthlyReportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = monthlyStatsData[selectedIdx];
  const deliveryRate = ((selected.delivered / selected.totalPackages) * 100).toFixed(1);
  const incidentRate = ((selected.incidents / selected.totalPackages) * 100).toFixed(1);

  const chartData = monthlyStatsData.map((m) => ({
    name: m.month.slice(0, 3),
    Paket: m.totalPackages,
    Terkirim: m.delivered,
    Insiden: m.incidents,
  }));

  const gforceChart = monthlyStatsData.map((m) => ({
    name: m.month.slice(0, 3),
    "Rata-rata G": m.avgGForce,
    "Maks G": m.maxGForce,
  }));

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/ai/monthly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected),
      });
      if (!resp.ok) {
        const d = await resp.json();
        throw new Error(d.error || "API error");
      }
      const data: MonthlyReportResult = await resp.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat laporan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Laporan Bulanan AI
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Laporan performa pengiriman bulanan dianalisa oleh Gemini AI
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Month Selector */}
          <div className="relative">
            <select
              value={selectedIdx}
              onChange={(e) => {
                setSelectedIdx(Number(e.target.value));
                setReport(null);
              }}
              className="appearance-none bg-card border border-border rounded-lg px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
            >
              {monthlyStatsData.map((m, i) => (
                <option key={i} value={i}>
                  {m.month} {m.year}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>
          <button
            onClick={generateReport}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Membuat Laporan...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                Generate Laporan AI
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Paket" value={selected.totalPackages} sub={`${selected.month} ${selected.year}`} icon={Package} color="blue" trend="neutral" />
        <StatCard label="Berhasil Terkirim" value={`${deliveryRate}%`} sub={`${selected.delivered} paket`} icon={CheckCircle2} color="green" trend="up" />
        <StatCard label="Total Insiden" value={selected.incidents} sub={`${incidentRate}% dari total`} icon={AlertTriangle} color="yellow" trend="down" />
        <StatCard label="Paket Rusak" value={selected.damagedPackages} sub={`${selected.criticalIncidents} kritis`} icon={AlertTriangle} color="red" trend="down" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shipment Volume Chart */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-primary" />
            Volume Pengiriman (5 Bulan)
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "11px" }}
              />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Bar dataKey="Paket" fill="#3b82f6" opacity={0.8} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Terkirim" fill="#14b8a6" opacity={0.8} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Insiden" fill="#f59e0b" opacity={0.8} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* G-Force Trend Chart */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Tren G-Force (5 Bulan)
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={gforceChart} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "11px" }}
              />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Line type="monotone" dataKey="Rata-rata G" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Maks G" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Routes Table */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Performa Rute — {selected.month} {selected.year}</h3>
        <div className="space-y-2">
          {selected.topRoutes.map((r, i) => {
            const rateInc = ((r.incidents / r.count) * 100).toFixed(0);
            const isBad = Number(rateInc) > 10;
            return (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                <span className="text-xs font-bold text-muted-foreground w-4 text-center">{i + 1}</span>
                <span className="text-xs text-foreground flex-1">{r.route}</span>
                <span className="text-xs text-muted-foreground">{r.count} paket</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${isBad ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
                  {r.incidents} insiden ({rateInc}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400 text-center">
            {/MISSING_KEY|not configured/i.test(error)
              ? "GEMINI_API_KEY belum dikonfigurasi. Tambahkan di .env.local lalu restart server dev."
              : /INVALID_KEY|permission/i.test(error)
              ? "API key Gemini tidak valid. Buat ulang di https://aistudio.google.com/app/apikey"
              : error}
          </p>
        </div>
      )}

      {/* AI Report Result */}
      {report && (
        <div className="rounded-xl border border-primary/30 bg-card overflow-hidden">
          {/* Report Header */}
          <div className="bg-gradient-to-r from-primary/10 to-transparent border-b border-primary/20 px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground text-sm">{report.reportTitle}</h3>
                    {report.fallback && (
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30" title="Gemini rate-limited, laporan dibuat dari analisa rule-based">
                        Rule-based
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {report.fallback ? "Analisa rule-based (Gemini rate-limited)" : "Dihasilkan oleh Gemini 2.5 Flash"} · {selected.month} {selected.year}
                  </p>
                </div>
              </div>
              <div className={`flex flex-col items-center px-4 py-2 rounded-xl bg-card border ${gradeGlow[report.grade]} shadow-lg`}>
                <span className={`text-3xl font-black ${gradeColor[report.grade]}`}>{report.grade}</span>
                <span className="text-[10px] text-muted-foreground">{report.overallScore}/100</span>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* Executive Summary */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Star className="h-3 w-3 text-primary" />
                Ringkasan Eksekutif
              </h4>
              <p className="text-sm text-foreground leading-relaxed">{report.executiveSummary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Performance Analysis */}
              <div className="rounded-lg border border-border bg-secondary/20 p-3">
                <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Analisis Performa</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{report.performanceAnalysis}</p>
              </div>
              {/* Risk Assessment */}
              <div className="rounded-lg border border-border bg-secondary/20 p-3">
                <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Penilaian Risiko</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{report.riskAssessment}</p>
              </div>
              {/* Route Analysis */}
              <div className="rounded-lg border border-border bg-secondary/20 p-3">
                <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Analisis Rute</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{report.routeAnalysis}</p>
              </div>
              {/* Outlook */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <h4 className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2">Proyeksi Bulan Depan</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{report.outlook}</p>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Rekomendasi AI</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {report.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-secondary/30 border border-border">
                    <span className="h-4 w-4 rounded-full bg-primary/20 text-primary text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-xs text-muted-foreground leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Note */}
            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => {
                  const text = `LAPORAN BULANAN SAFETRACK\n${report.reportTitle}\n\nRingkasan: ${report.executiveSummary}\n\nPerforma: ${report.performanceAnalysis}\n\nRisiko: ${report.riskAssessment}\n\nAnalisis Rute: ${report.routeAnalysis}\n\nRekomendasi:\n${report.recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}\n\nProyeksi: ${report.outlook}\n\nSkor: ${report.overallScore}/100 (${report.grade})`;
                  const blob = new Blob([text], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `laporan-${selected.month.toLowerCase()}-${selected.year}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                Unduh Laporan
              </button>
            </div>
          </div>
        </div>
      )}

      {!report && !loading && (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
          <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">Belum ada laporan AI</p>
          <p className="text-xs text-muted-foreground mt-1">
            Pilih bulan dan klik <span className="text-primary">"Generate Laporan AI"</span> untuk membuat laporan analisa mendalam dari Gemini AI
          </p>
        </div>
      )}
    </div>
  );
}
