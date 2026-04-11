import {
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

const flowSteps: { title: string; note: string; icon: LucideIcon; span: string }[] = [
  { title: "ESP32 + sensors", note: "Shock, frequency, acceleration.", icon: Cpu, span: "lg:col-span-5" },
  { title: "Gateway", note: "MQTT / HTTPS batches outbound.", icon: Router, span: "lg:col-span-7" },
  { title: "API route", note: "Validate, forward to inference.", icon: GitBranch, span: "lg:col-span-4" },
  { title: "ONNX", note: "Score, label, model hash.", icon: Brain, span: "lg:col-span-4" },
  { title: "0G storage", note: "CID-backed evidence.", icon: Database, span: "lg:col-span-4" },
  { title: "Escrow", note: "Threshold-driven settlement.", icon: Lock, span: "lg:col-span-6" },
  { title: "Dashboard", note: "Timeline and proofs.", icon: BarChart3, span: "lg:col-span-6" },
  { title: "Users", note: "Scan, claim, confirm.", icon: Users, span: "lg:col-span-12" },
];

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

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:mt-14 lg:grid-cols-12 lg:gap-4">
          {flowSteps.map((step, idx) => {
            const Icon = step.icon;
            const isWide = step.span.includes("col-span-12");
            return (
              <div
                key={step.title}
                className={`glass noise-overlay flex flex-col rounded-2xl p-5 sm:p-6 ${step.span} ${
                  isWide ? "sm:col-span-2 lg:flex-row lg:items-center lg:gap-10 lg:p-8" : "min-h-[140px] lg:min-h-[160px]"
                }`}
              >
                <div className="mb-4 flex shrink-0 items-center gap-3 lg:mb-0">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)]/12 text-[var(--accent)]">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="font-mono text-xs tabular-nums text-[var(--text-muted)] lg:hidden">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 hidden items-center gap-3 lg:flex">
                    <span className="font-mono text-xs tabular-nums text-[var(--text-muted)]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 max-w-[3rem] bg-[var(--glass-border)]" aria-hidden />
                  </div>
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
