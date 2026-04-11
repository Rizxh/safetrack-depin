import { LandingSectionHeader } from "@/components/layout/LandingSectionHeader";

const steps = [
  {
    title: "Attach the device",
    description:
      "ESP32 inside the box—shock, temperature, humidity on a steady cadence.",
  },
  {
    title: "AI in real time",
    description: "Risk score updates continuously; anomalies surface immediately.",
  },
  {
    title: "Claim with proof",
    description: "Events on 0G—immutable records when you need to settle a dispute.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="landing-section-x scroll-mt-28 border-t border-[var(--glass-border)]/40 py-24 md:py-28"
    >
      <div className="landing-content">
        <LandingSectionHeader
          label="How it works"
          title="Three steps. No playbook required."
          description="From hardware to dashboard in minutes."
        />

        <div className="mt-12 grid gap-6 md:mt-14 md:grid-cols-3 md:gap-8">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="glass noise-overlay flex min-h-[200px] flex-col rounded-2xl p-8 md:min-h-[220px] md:p-9"
            >
              <span className="font-mono text-sm tabular-nums text-[var(--accent)]">0{idx + 1}</span>
              <h3 className="mt-6 text-xl font-semibold leading-snug text-[var(--text-primary)]">{step.title}</h3>
              <p className="mt-4 flex-1 text-base leading-[1.7] text-[var(--text-secondary)]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
