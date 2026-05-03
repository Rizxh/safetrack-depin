"use client";

import { useState } from "react";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
} from "lucide-react";
import { shipmentData } from "@/data/mockData";
import type { Prediction } from "@/pages/api/ai/predictions";

const statusIcon = {
  safe: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
};

const statusStyle = {
  safe: "text-green-400",
  warning: "text-yellow-400",
  danger: "text-red-400",
};

const trendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

async function fetchPredictions(): Promise<Prediction[]> {
  const resp = await fetch("/api/ai/predictions", { method: "POST" });
  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.error || "API error");
  }
  return resp.json();
}

export function PredictionsSection() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPredictions();
      setPredictions(data);
      setGenerated(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat prediksi AI"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Predictions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Prediksi berbasis data sensor IoT real-time menggunakan Gemini AI
          </p>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : generated ? (
            <>
              <RefreshCw className="h-4 w-4" />
              Refresh Prediksi
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Generate Prediksi AI
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">
            {/MISSING_KEY|not configured/i.test(error)
              ? "API Key Gemini belum dikonfigurasi. Tambahkan GEMINI_API_KEY di .env.local lalu restart server."
              : /INVALID_KEY|permission/i.test(error)
              ? "API key Gemini tidak valid. Buat ulang di https://aistudio.google.com/app/apikey"
              : error}
          </p>
        </div>
      )}

      {!generated && !loading && !error && (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
          <Brain className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">Prediksi AI belum dibuat</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Klik tombol <span className="text-primary">"Generate Prediksi AI"</span> untuk menganalisa {shipmentData.length} paket aktif dengan Gemini AI
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-[10px] text-muted-foreground">
            <span className="px-2 py-1 rounded-full bg-secondary">{shipmentData.length} paket dianalisa</span>
            <span className="px-2 py-1 rounded-full bg-secondary">{shipmentData.filter((s) => s.status === "critical").length} kritis</span>
            <span className="px-2 py-1 rounded-full bg-secondary">{shipmentData.filter((s) => s.status === "warning").length} warning</span>
          </div>
        </div>
      )}

      {predictions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictions.map((p, idx) => {
            const TrendIcon = trendIcon[p.trend];
            const StatusIcon = statusIcon[p.status];
            return (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-colors flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`h-4 w-4 shrink-0 ${statusStyle[p.status]}`} />
                    <h3 className="font-semibold text-foreground text-sm">{p.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <TrendIcon
                      className={`h-3.5 w-3.5 ${p.trend === "up" ? "text-primary" : p.trend === "down" ? "text-destructive" : "text-muted-foreground"}`}
                    />
                    <span className="text-xs font-medium text-foreground">{p.confidence}%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.summary}</p>

                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-[10px] text-muted-foreground bg-secondary px-2 py-1 rounded">
                      {p.breakdown}
                    </code>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      p.status === "safe" ? "bg-green-500/10 text-green-400" :
                      p.status === "warning" ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-red-500/10 text-red-400"
                    }`}>
                      {p.status === "safe" ? "Aman" : p.status === "warning" ? "Perhatian" : "Bahaya"}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${p.confidence}%`,
                        backgroundColor: p.status === "safe" ? "#22c55e" : p.status === "warning" ? "#f59e0b" : "#ef4444",
                        opacity: 0.7,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-sm font-medium text-foreground">Gemini AI Engine Status</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Memproses {shipmentData.length} data stream aktif. Model: Gemini 2.5 Flash (auto-fallback ke Flash Lite saat rate limit) ·{" "}
          {generated ? (
            <span className="text-green-400">Prediksi terakhir berhasil dibuat</span>
          ) : (
            <span>Belum ada prediksi — klik Generate untuk memulai</span>
          )}
        </p>
      </div>
    </div>
  );
}
