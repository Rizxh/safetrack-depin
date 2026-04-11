import { Activity, Box, ShieldCheck } from "lucide-react";

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
    <section id="about" className="scroll-mt-28 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">About</p>
        <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-[1.2] tracking-tight text-[var(--text-primary)] md:text-4xl lg:text-[2.5rem] lg:leading-tight">
          Logistics intelligence, stripped to what operators actually need.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-[1.75] text-[var(--text-secondary)] md:text-xl md:leading-relaxed">
          ESP32 telemetry, ONNX scoring, and 0G-backed evidence—so every event is explainable when it matters.
        </p>

        {/* BENTO — hanya di About: preview lebar + kolom kartu */}
        <div className="mt-16 grid gap-6 md:mt-20 lg:grid-cols-12 lg:gap-8">
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
                <div key={card.title} className="glass rounded-2xl p-6 md:p-7">
                  <div className="flex gap-5">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--text-muted)]" strokeWidth={1.25} />
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
