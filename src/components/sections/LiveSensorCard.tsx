import { Activity, Box, ShieldCheck } from "lucide-react";
import { LandingSectionHeader } from "@/components/layout/LandingSectionHeader";

const cards = [
  {
    title: "Package health",
    subtitle: "SHIP-2024-091",
    value: "94% safe",
    icon: ShieldCheck,
    points: ["28.4°C · 61% RH", "Shock stable"],
  },
  {
    title: "Route",
    subtitle: "Jakarta → Surabaya",
    value: "12 stops",
    icon: Activity,
    points: ["2 alerts", "ETA +11 min"],
  },
  {
    title: "Escrow",
    subtitle: "Contract #0G-4A9",
    value: "Clear",
    icon: Box,
    points: ["1.20 USDT", "18 CIDs"],
  },
];

export default function LiveSensorCard() {
  return (
    <section
      id="about"
      className="landing-section-x scroll-mt-28 border-t border-[var(--glass-border)]/40 py-24 md:py-28"
    >
      <div className="landing-content flex flex-col lg:block">
        <LandingSectionHeader
          className="order-2 mt-10 max-w-none lg:order-1 lg:mt-0 lg:max-w-3xl"
          label="About"
          title="Logistics intelligence, stripped to what operators actually need."
          description="ESP32 telemetry, ONNX scoring, and 0G-backed evidence—so every event is explainable when it matters."
        />

        <div className="order-1 mt-0 grid gap-6 lg:order-2 lg:mt-12 lg:grid-cols-12 lg:gap-8 xl:mt-14 xl:gap-10">
          <div className="noise-overlay glass relative overflow-hidden rounded-2xl p-8 md:p-10 lg:col-span-7">
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-90"
              style={{ background: "var(--gradient-card)" }}
              aria-hidden
            />
            <div className="relative z-10">
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">Preview</p>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">Dashboard</p>
              <div className="mt-12 grid grid-cols-2 gap-x-10 gap-y-8 sm:max-w-md">
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Risk</p>
                  <p className="mt-2 text-3xl font-normal tabular-nums text-[var(--text-primary)]">94%</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Inference</p>
                  <p className="mt-2 text-3xl font-normal tabular-nums text-[var(--text-primary)]">0.9ms</p>
                </div>
              </div>
              <p className="mt-12 text-sm leading-relaxed text-[var(--text-muted)]">
                Last sync 2m ago · 18 proofs anchored
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:col-span-5">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="glass noise-overlay rounded-2xl p-6 md:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] sm:h-auto sm:w-auto sm:justify-start sm:rounded-none sm:bg-transparent sm:text-[var(--text-muted)]">
                      <Icon className="h-5 w-5 sm:mt-0.5" strokeWidth={1.25} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[var(--text-muted)]">{card.subtitle}</p>
                      <h3 className="mt-2 text-lg font-medium text-[var(--text-primary)]">{card.title}</h3>
                      <p className="mt-2 text-sm font-medium text-[var(--accent)]">{card.value}</p>
                      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {card.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
