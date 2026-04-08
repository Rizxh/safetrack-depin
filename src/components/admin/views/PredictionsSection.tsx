import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  HelpCircle,
} from "lucide-react";
import { shipmentData } from "@/data/mockData";

const predictions = [
  {
    title: "Route Optimization",
    confidence: 87,
    trend: "up" as const,
    summary:
      "Hamburg → Rotterdam route shows 15% lower impact frequency when using A7 corridor.",
    breakdown: "Peak Freq: 45Hz | RMS: 1.2g",
  },
  {
    title: "Battery Degradation",
    confidence: 72,
    trend: "down" as const,
    summary:
      "BOX-6W15 and BOX-1P87 batteries projected to drop below 20% within 48 hours.",
    breakdown: "Discharge Rate: +0.4%/hr",
  },
  {
    title: "Seasonal Impact Pattern",
    confidence: 94,
    trend: "up" as const,
    summary:
      "G-force incidents increase 23% during Q2 monsoon season on Asia-Pacific routes.",
    breakdown: "Historical Match: 98%",
  },
  {
    title: "Packaging Recommendation",
    confidence: 68,
    trend: "neutral" as const,
    summary:
      "Switching to Type-C foam inserts could reduce damage likelihood by 31% for fragile cargo.",
    breakdown: "Material Density: Low",
  },
];

export function PredictionsSection() {
  const TrendIcon = { up: TrendingUp, down: TrendingDown, neutral: Minus };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          AI Predictions (Mirofish)
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Predictive analysis powered by Mirofish AI engine
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictions.map((p) => {
          const Icon = TrendIcon[p.trend];
          return (
            <div
              key={p.title}
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-colors flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary shrink-0" />
                  <h3 className="font-semibold text-foreground text-sm">
                    {p.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Icon
                    className={`h-3.5 w-3.5 ${p.trend === "up" ? "text-primary" : p.trend === "down" ? "text-destructive" : "text-muted-foreground"}`}
                  />
                  <span className="text-xs font-medium text-foreground">
                    {p.confidence}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {p.summary}
              </p>

              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <code className="text-[10px] text-muted-foreground bg-secondary px-2 py-1 rounded">
                    {p.breakdown}
                  </code>

                  <div className="relative group flex items-center cursor-help">
                    <span className="text-[10px] font-medium text-primary mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Why this score?
                    </span>
                    <HelpCircle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-popover border border-border rounded shadow-lg text-[10px] text-popover-foreground opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      Based on continuous learning from 10k+ DePIN sensor logs
                      in the last 30 days.
                    </div>
                  </div>
                </div>

                <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary/60"
                    style={{ width: `${p.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-sm font-medium text-foreground">
            Mirofish Engine Status
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Processing {shipmentData.length} active data streams. Model accuracy:
          91.4% (last 30 days). Next retraining cycle: April 15, 2026.
        </p>
      </div>
    </div>
  );
}
