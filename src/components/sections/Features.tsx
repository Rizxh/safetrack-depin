import { LandingSectionHeader } from "@/components/layout/LandingSectionHeader";

const features = [
  {
    title: "Live route",
    line: "Checkpoints, drift, and stops in one timeline.",
  },
  {
    title: "AI safety score",
    line: "ONNX in milliseconds—patterns, not guesswork.",
  },
  {
    title: "0G proofs",
    line: "Hashes and CIDs you can audit later.",
  },
  {
    title: "Escrow automation",
    line: "Rules that execute when thresholds are met.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="landing-section-x scroll-mt-28 border-t border-[var(--glass-border)]/40 py-24 md:py-28"
    >
      <div className="landing-content">
        <LandingSectionHeader
          label="Features"
          title="Focused tools—not a feature warehouse."
          description="Everything you need to run calmer shipments, without tab sprawl."
        />

        <div className="glass noise-overlay mt-12 overflow-hidden rounded-2xl md:mt-14">
          <ul className="divide-y divide-[var(--glass-border)]">
            {features.map((feature) => (
              <li
                key={feature.title}
                className="grid gap-4 px-6 py-9 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-14 sm:px-8 sm:py-10 md:px-10"
              >
                <span className="text-lg font-medium text-[var(--text-primary)]">{feature.title}</span>
                <span className="text-base leading-[1.7] text-[var(--text-secondary)]">{feature.line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
