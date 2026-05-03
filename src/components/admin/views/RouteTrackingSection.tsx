"use client";

import { useState } from "react";
import {
  MapPin,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Truck,
  Ship,
  Plane,
  Brain,
  Zap,
  Battery,
  Signal,
  Thermometer,
  Droplets,
  ChevronRight,
  ArrowRight,
  Loader2,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { routesData, type Route, type RoutePackage } from "@/data/routeData";
import type { PackageAnalysisResult } from "@/pages/api/ai/analyze-package";

type AnalysisMap = Record<string, PackageAnalysisResult | "loading" | "error">;

const statusConfig = {
  "in-transit": {
    label: "In Transit",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
  },
  delivered: {
    label: "Delivered",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    dot: "bg-green-400",
  },
  alert: {
    label: "Alert",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    dot: "bg-yellow-400",
  },
  critical: {
    label: "Critical",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-400",
  },
};

const aiStatusConfig = {
  SAFE: {
    label: "Aman",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    icon: CheckCircle2,
  },
  AT_RISK: {
    label: "Berisiko",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    icon: AlertTriangle,
  },
  DAMAGED: {
    label: "Rusak",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    icon: XCircle,
  },
  CRITICAL: {
    label: "Kritis",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: XCircle,
  },
};

const routeTypeIcon = {
  land: Truck,
  sea: Ship,
  air: Plane,
};

function GForceSparkline({ data }: { data: number[] }) {
  const chartData = data.map((v, i) => ({ i, v }));
  const max = Math.max(...data);
  const isDanger = max > 7;
  const isWarning = max > 4;
  const color = isDanger ? "#ef4444" : isWarning ? "#f59e0b" : "#14b8a6";

  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <defs>
          <linearGradient id={`grad-${max}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <ReferenceLine y={7} stroke="#ef4444" strokeDasharray="2 2" strokeOpacity={0.4} />
        <ReferenceLine y={4} stroke="#f59e0b" strokeDasharray="2 2" strokeOpacity={0.3} />
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#grad-${max})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function PackageCard({
  pkg,
  analysis,
  onAnalyze,
}: {
  pkg: RoutePackage;
  analysis?: PackageAnalysisResult | "loading" | "error";
  onAnalyze: (pkg: RoutePackage) => void;
}) {
  const status = statusConfig[pkg.status];
  const isLoading = analysis === "loading";
  const isError = analysis === "error";
  const result = typeof analysis === "object" ? analysis : null;
  const aiConf = result ? aiStatusConfig[result.status] : null;
  const AiIcon = aiConf?.icon;

  return (
    <div className={`rounded-xl border bg-card p-4 transition-all hover:border-primary/20 ${result ? `border-${result.status === "SAFE" ? "green" : result.status === "AT_RISK" ? "yellow" : "red"}-500/20` : "border-border"}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary shrink-0" />
            <span className="font-semibold text-sm text-foreground">{pkg.boxId}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{pkg.contents}</p>
        </div>
        <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${status.bg} ${status.color} border ${status.border}`}>
          {status.label}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 mb-3">
        <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground truncate">{pkg.currentLocation}</span>
        <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground truncate">{pkg.destination}</span>
      </div>

      {/* G-Force Sparkline */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground">G-Force History</span>
          <span className={`text-[10px] font-semibold ${pkg.gForcePeak > 7 ? "text-red-400" : pkg.gForcePeak > 4 ? "text-yellow-400" : "text-green-400"}`}>
            Peak: {pkg.gForcePeak}G
          </span>
        </div>
        <GForceSparkline data={pkg.gForceHistory} />
      </div>

      {/* Sensor Metrics */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="flex flex-col items-center gap-0.5">
          <Battery className={`h-3 w-3 ${pkg.battery < 40 ? "text-red-400" : pkg.battery < 70 ? "text-yellow-400" : "text-green-400"}`} />
          <span className="text-[10px] text-muted-foreground">{pkg.battery}%</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <Signal className={`h-3 w-3 ${pkg.signalStrength < 40 ? "text-red-400" : pkg.signalStrength < 60 ? "text-yellow-400" : "text-green-400"}`} />
          <span className="text-[10px] text-muted-foreground">{pkg.signalStrength}%</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <Thermometer className="h-3 w-3 text-blue-400" />
          <span className="text-[10px] text-muted-foreground">{pkg.temperature}°C</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <Droplets className="h-3 w-3 text-cyan-400" />
          <span className="text-[10px] text-muted-foreground">{pkg.humidity}%</span>
        </div>
      </div>

      {/* AI Analysis Result */}
      {result && aiConf && AiIcon && (
        <div className={`rounded-lg p-3 mb-3 border ${aiConf.bg} ${aiConf.border}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <AiIcon className={`h-3.5 w-3.5 ${aiConf.color}`} />
            <span className={`text-xs font-semibold ${aiConf.color}`}>{result.title}</span>
            {result.fallback && (
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30" title="Gemini rate-limited, menggunakan analisa rule-based">
                Rule-based
              </span>
            )}
            <span className="ml-auto text-[10px] text-muted-foreground">{result.confidence}% keyakinan</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">{result.details}</p>
          {result.recommendations.length > 0 && (
            <div className="space-y-1">
              {result.recommendations.slice(0, 2).map((rec, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <ArrowRight className={`h-2.5 w-2.5 mt-0.5 shrink-0 ${aiConf.color}`} />
                  <span className="text-[10px] text-muted-foreground">{rec}</span>
                </div>
              ))}
            </div>
          )}
          {/* Risk Score Bar */}
          <div className="mt-2">
            <div className="flex justify-between mb-1">
              <span className="text-[9px] text-muted-foreground">Risk Score</span>
              <span className={`text-[9px] font-medium ${aiConf.color}`}>{result.riskScore}/100</span>
            </div>
            <div className="h-1 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${result.riskScore > 70 ? "bg-red-500" : result.riskScore > 40 ? "bg-yellow-500" : "bg-green-500"}`}
                style={{ width: `${result.riskScore}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {isError && (
        <div className="rounded-lg p-2 mb-3 bg-red-500/10 border border-red-500/20 text-center">
          <span className="text-[11px] text-red-400">Gagal menganalisa. Cek API key Gemini.</span>
        </div>
      )}

      {/* Analyze Button */}
      {pkg.status !== "delivered" && (
        <button
          onClick={() => onAnalyze(pkg)}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Menganalisa dengan Gemini AI...
            </>
          ) : result ? (
            <>
              <RefreshCw className="h-3 w-3" />
              Analisa Ulang
            </>
          ) : (
            <>
              <Brain className="h-3 w-3" />
              Analisa dengan Gemini AI
            </>
          )}
        </button>
      )}
      {pkg.status === "delivered" && (
        <div className="text-center py-1">
          <span className="text-[10px] text-green-400 flex items-center justify-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Terkirim — tidak perlu analisa
          </span>
        </div>
      )}
    </div>
  );
}

export function RouteTrackingSection() {
  const [selectedRoute, setSelectedRoute] = useState<Route>(routesData[0]);
  const [analysisMap, setAnalysisMap] = useState<AnalysisMap>({});
  const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);

  const analyzePackage = async (pkg: RoutePackage, routeName: string) => {
    setAnalysisMap((prev) => ({ ...prev, [pkg.id]: "loading" }));
    try {
      const resp = await fetch("/api/ai/analyze-package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boxId: pkg.boxId,
          gForcePeak: pkg.gForcePeak,
          gForceHistory: pkg.gForceHistory,
          battery: pkg.battery,
          signalStrength: pkg.signalStrength,
          temperature: pkg.temperature,
          humidity: pkg.humidity,
          location: pkg.currentLocation,
          routeName,
          timestamp: pkg.lastUpdated,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || "error" in data) {
        setAnalysisMap((prev) => ({ ...prev, [pkg.id]: "error" }));
        return;
      }
      setAnalysisMap((prev) => ({ ...prev, [pkg.id]: data as PackageAnalysisResult }));
    } catch {
      setAnalysisMap((prev) => ({ ...prev, [pkg.id]: "error" }));
    }
  };

  const analyzeAll = async () => {
    setIsAnalyzingAll(true);
    const pkgsToAnalyze = selectedRoute.packages.filter((p) => p.status !== "delivered");
    for (const pkg of pkgsToAnalyze) {
      await analyzePackage(pkg, selectedRoute.name);
      await new Promise((r) => setTimeout(r, 500));
    }
    setIsAnalyzingAll(false);
  };

  const routeStats = {
    safe: selectedRoute.packages.filter((p) => {
      const a = analysisMap[p.id];
      return typeof a === "object" && a.status === "SAFE";
    }).length,
    atRisk: selectedRoute.packages.filter((p) => {
      const a = analysisMap[p.id];
      return typeof a === "object" && a.status === "AT_RISK";
    }).length,
    damaged: selectedRoute.packages.filter((p) => {
      const a = analysisMap[p.id];
      return typeof a === "object" && (a.status === "DAMAGED" || a.status === "CRITICAL");
    }).length,
    analyzed: selectedRoute.packages.filter((p) => typeof analysisMap[p.id] === "object").length,
  };

  const TypeIcon = routeTypeIcon[selectedRoute.type];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Route Tracking & AI Analysis
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tracking paket per jalur pengiriman dengan analisa kondisi oleh Gemini AI
          </p>
        </div>
        {selectedRoute.packages.filter((p) => p.status !== "delivered").length > 0 && (
          <button
            onClick={analyzeAll}
            disabled={isAnalyzingAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            {isAnalyzingAll ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menganalisa Semua...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Analisa Semua Paket
              </>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Route List */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">
            Jalur Pengiriman
          </h3>
          {routesData.map((route) => {
            const RouteIcon = routeTypeIcon[route.type];
            const isActive = selectedRoute.id === route.id;
            return (
              <button
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isActive
                    ? "bg-primary/10 border-primary/30 shadow-sm"
                    : "bg-card border-border hover:border-primary/20 hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <RouteIcon className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-xs font-semibold truncate ${isActive ? "text-primary" : "text-foreground"}`}>
                    {route.name}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-muted-foreground">{route.totalPackages} paket · {route.distance}</span>
                  {route.alertCount > 0 && (
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                      {route.alertCount} alert
                    </span>
                  )}
                </div>
                {/* Route color bar */}
                <div className="mt-2 h-0.5 rounded-full" style={{ backgroundColor: route.color, opacity: isActive ? 1 : 0.4 }} />
              </button>
            );
          })}
        </div>

        {/* Main: Route Detail + Packages */}
        <div className="lg:col-span-3 space-y-4">
          {/* Route Header */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${selectedRoute.color}20`, border: `1px solid ${selectedRoute.color}40` }}>
                  <TypeIcon className="h-5 w-5" style={{ color: selectedRoute.color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedRoute.name}</h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground">{selectedRoute.distance}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{selectedRoute.duration}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs capitalize text-muted-foreground">{selectedRoute.type === "land" ? "Darat" : selectedRoute.type === "sea" ? "Laut" : "Udara"}</span>
                  </div>
                </div>
              </div>

              {/* AI Summary Stats */}
              {routeStats.analyzed > 0 && (
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                    <span className="text-muted-foreground">Aman: <span className="text-foreground font-medium">{routeStats.safe}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-yellow-400" />
                    <span className="text-muted-foreground">Berisiko: <span className="text-foreground font-medium">{routeStats.atRisk}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="text-muted-foreground">Rusak: <span className="text-foreground font-medium">{routeStats.damaged}</span></span>
                  </div>
                </div>
              )}
            </div>

            {/* Route Stats Row */}
            <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{selectedRoute.totalPackages}</p>
                <p className="text-[10px] text-muted-foreground">Total Paket</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-400">
                  {selectedRoute.packages.filter((p) => p.status === "delivered").length}
                </p>
                <p className="text-[10px] text-muted-foreground">Terkirim</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-400">
                  {selectedRoute.packages.filter((p) => p.status === "in-transit").length}
                </p>
                <p className="text-[10px] text-muted-foreground">In Transit</p>
              </div>
              <div className="text-center">
                <p className={`text-lg font-bold ${selectedRoute.alertCount > 0 ? "text-red-400" : "text-muted-foreground"}`}>
                  {selectedRoute.alertCount}
                </p>
                <p className="text-[10px] text-muted-foreground">Alert</p>
              </div>
            </div>
          </div>

          {/* Gemini AI Note */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 flex items-center gap-3">
            <Brain className="h-4 w-4 text-primary shrink-0" />
            <p className="text-xs text-muted-foreground">
              <span className="text-foreground font-medium">Gemini AI</span> menganalisa data sensor IoT (G-Force, baterai, sinyal, suhu, kelembaban) untuk menentukan kondisi paket secara real-time. Tekan tombol <span className="text-primary font-medium">"Analisa Semua Paket"</span> atau analisa per paket.
            </p>
          </div>

          {/* Package Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {selectedRoute.packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                analysis={analysisMap[pkg.id]}
                onAnalyze={(p) => analyzePackage(p, selectedRoute.name)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
