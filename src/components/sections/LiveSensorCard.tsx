import { Activity, Box, ShieldCheck, Thermometer } from "lucide-react";

const cards = [
  {
    title: "Live Package Health",
    subtitle: "SHIP-2024-091",
    value: "SAFE 94%",
    icon: ShieldCheck,
    points: ["Temp: 28.4 C", "Humidity: 61%", "Shock freq: 0.32 Hz"],
  },
  {
    title: "Courier Route + Events",
    subtitle: "Jakarta -> Surabaya",
    value: "12 checkpoints",
    icon: Activity,
    points: ["2 anomaly alerts", "ETA drift: +11 min", "Signal stable: 99.2%"],
  },
  {
    title: "Escrow Claim Status",
    subtitle: "Contract #0G-4A9",
    value: "No active claim",
    icon: Box,
    points: ["Deposit: 1.20 USDT", "CID proofs: 18", "Last scan: 2m ago"],
  },
];

export default function LiveSensorCard() {
  return (
    <section id="about" className="relative overflow-hidden bg-black px-4 pb-20 pt-20 text-white sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.16),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.16),transparent_35%)]" />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-xs font-medium uppercase tracking-widest text-teal-300">About SafeTrace</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
          First-class smart tracking experience for logistics and customers.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-300">
          We build a modern shipping intelligence platform powered by ESP32 sensors, ONNX inference, and 0G
          decentralized storage. Every shipment event is scored, verified, and ready for claim automation.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/3 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
              <div className="mb-3 flex items-center justify-between text-sm text-zinc-300">
                <span>SafeTrace Dashboard</span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-300">
                  Live
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/3 p-3">
                  <p className="text-xs text-zinc-400">Risk Score</p>
                  <p className="mt-1 text-2xl font-semibold text-emerald-300">94%</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/3 p-3">
                  <p className="text-xs text-zinc-400">Inference</p>
                  <p className="mt-1 text-2xl font-semibold text-sky-300">0.9ms</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/3 p-3">
                  <p className="text-xs text-zinc-400">CID Proofs</p>
                  <p className="mt-1 text-xl font-semibold">18</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/3 p-3">
                  <p className="text-xs text-zinc-400">Alerts</p>
                  <p className="mt-1 text-xl font-semibold text-amber-300">2 warning</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-white/10 bg-white/3 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm">
                  <Thermometer className="h-4 w-4 text-sky-300" />
                  <span className="text-zinc-300">Realtime telemetry stream</span>
                </div>
                <div className="space-y-1 text-xs text-zinc-400">
                  <p>[08:26:01] TEMP=28.4C HUM=61% G=1.02 SCORE=94</p>
                  <p>[08:26:02] TEMP=28.4C HUM=62% G=1.01 SCORE=94</p>
                  <p>[08:26:03] TEMP=28.5C HUM=62% G=1.05 SCORE=92</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="rounded-2xl border border-white/10 bg-white/3 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-zinc-400">{card.subtitle}</p>
                      <h3 className="mt-1 text-xl font-semibold">{card.title}</h3>
                    </div>
                    <Icon className="h-5 w-5 text-emerald-300" />
                  </div>
                  <p className="mt-2 text-sm text-emerald-300">{card.value}</p>
                  <ul className="mt-3 space-y-1 text-sm text-zinc-300">
                    {card.points.map((point) => (
                      <li key={point}>- {point}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
