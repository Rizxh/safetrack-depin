import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Box,
  Brain,
  Cpu,
  Database,
  GitBranch,
  Lock,
  Router,
  type LucideIcon,
  Users,
} from "lucide-react";
import { LandingSectionHeader } from "@/components/layout/LandingSectionHeader";

/** `right` / `down` = panah ke langkah berikutnya (desktop); mobile pakai strip linear */
const flowSteps: {
  title: string;
  note: string;
  icon: LucideIcon;
  span: string;
  connector: "right" | "down" | null;
}[] = [
  { title: "ESP32 + sensors", note: "Shock, frequency, acceleration.", icon: Cpu, span: "lg:col-span-5", connector: "right" },
  { title: "Gateway", note: "MQTT / HTTPS batches outbound.", icon: Router, span: "lg:col-span-7", connector: "down" },
  { title: "API route", note: "Validate, forward to inference.", icon: GitBranch, span: "lg:col-span-4", connector: "right" },
  { title: "ONNX", note: "Score, label, model hash.", icon: Brain, span: "lg:col-span-4", connector: "right" },
  { title: "0G storage", note: "CID-backed evidence.", icon: Database, span: "lg:col-span-4", connector: "down" },
  { title: "Escrow", note: "Threshold-driven settlement.", icon: Lock, span: "lg:col-span-6", connector: "right" },
  { title: "Dashboard", note: "Timeline and proofs.", icon: BarChart3, span: "lg:col-span-6", connector: "down" },
  { title: "Users", note: "Scan, claim, confirm.", icon: Users, span: "lg:col-span-12", connector: null },
];

function StepIndex({ n }: { n: number }) {
  const label = String(n).padStart(2, "0");
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/45 bg-[var(--bg-base)]/95 font-mono text-[11px] font-semibold tabular-nums tracking-tight text-[var(--accent)] shadow-sm ring-1 ring-[var(--accent)]/15"
      aria-label={`Langkah ${n}`}
    >
      {label}
    </span>
  );
}

export default function ProjectFlowSection() {
  return (
    <section
      id="flow"
      className="landing-section-x scroll-mt-28 border-t border-[var(--glass-border)]/40 py-24 md:py-28"
    >
      <div className="landing-content">
        <LandingSectionHeader
          label="System flow"
          title="From sensor to proof, in order."
          description="A single pipeline—no extra layers in the story."
        />

        {/* Linear flow hint — semua viewport */}
        <div
          className="glass noise-overlay mt-8 flex flex-col gap-3 rounded-2xl px-4 py-4 sm:mt-10 sm:flex-row sm:items-center sm:gap-4 sm:px-5 lg:mt-12"
          role="group"
          aria-label="Urutan langkah alur dari 01 hingga 08"
        >
          <span className="shrink-0 text-[10px] font-medium uppercase tracking-widest text-[var(--text-muted)]">
            Urutan alur
          </span>
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-0.5 gap-y-2 sm:gap-x-1">
            {flowSteps.map((step, idx) => (
              <span key={step.title} className="flex items-center">
                <span className="flex items-center gap-1.5 rounded-lg bg-[var(--bg-base)]/50 px-2 py-1 font-mono text-[11px] tabular-nums text-[var(--text-secondary)] ring-1 ring-[var(--glass-border)]/80">
                  <span className="text-[var(--accent)]">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="hidden max-w-[8rem] truncate text-[var(--text-muted)] sm:inline">{step.title}</span>
                </span>
                {idx < flowSteps.length - 1 && (
                  <ArrowRight
                    className="mx-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)] opacity-80"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:mt-8 lg:grid-cols-12 lg:gap-x-5 lg:gap-y-6">
          {flowSteps.map((step, idx) => {
            const Icon = step.icon;
            const isWide = step.span.includes("col-span-12");
            const conn = step.connector;

            return (
              <div
                key={step.title}
                className={`relative ${step.span} ${isWide ? "sm:col-span-2" : ""}`}
              >
                <div
                  className={`glass noise-overlay relative flex h-full flex-col rounded-2xl p-5 sm:p-6 ${isWide ? "lg:flex-row lg:items-center lg:gap-10 lg:p-8" : "min-h-[150px] lg:min-h-[168px]"}`}
                >
                  <div className={`flex gap-3 ${isWide ? "lg:items-center" : ""}`}>
                    <StepIndex n={idx + 1} />
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/12 text-[var(--accent)]">
                      <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                    </span>
                  </div>

                  <div className="mt-4 min-w-0 flex-1 lg:mt-0">
                    <h3 className="text-lg font-semibold leading-snug text-[var(--text-primary)]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">{step.note}</p>
                  </div>

                  {isWide && (
                    <div
                      className="mt-5 flex h-14 w-full shrink-0 items-center justify-center rounded-xl border border-dashed border-[var(--glass-border)] bg-[var(--bg-base)]/30 lg:mt-0 lg:h-24 lg:w-40"
                      aria-hidden
                    >
                      <Box className="h-8 w-8 text-[var(--text-muted)]" strokeWidth={1.25} />
                    </div>
                  )}

                  {/* Panah arah ke langkah berikut — desktop */}
                  {conn === "right" && (
                    <div
                      className="pointer-events-none absolute -right-3 top-1/2 z-30 hidden -translate-y-1/2 lg:flex"
                      aria-hidden
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--accent)]/35 bg-[var(--bg-elevated)] text-[var(--accent)] shadow-md shadow-black/20">
                        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                      </span>
                    </div>
                  )}
                  {conn === "down" && (
                    <div
                      className="pointer-events-none absolute -bottom-3 left-1/2 z-30 hidden -translate-x-1/2 lg:flex"
                      aria-hidden
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--accent)]/35 bg-[var(--bg-elevated)] text-[var(--accent)] shadow-md shadow-black/20">
                        <ArrowDown className="h-4 w-4" strokeWidth={2.5} />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
