import { ArrowUpRight } from "lucide-react";
import { LandingSectionHeader } from "@/components/layout/LandingSectionHeader";

const docs = [
  {
    title: "Overview",
    desc: "Product context and architecture.",
    href: "#about",
  },
  {
    title: "API",
    desc: "Telemetry, scores, webhooks.",
    href: "#contact-us",
  },
  {
    title: "Escrow flow",
    desc: "Risk thresholds and settlement.",
    href: "#docs",
  },
];

export default function DocsSection() {
  return (
    <section
      id="docs"
      className="landing-section-x scroll-mt-28 border-t border-[var(--glass-border)]/40 py-24 md:py-28"
    >
      <div className="landing-content">
        <LandingSectionHeader
          label="Docs"
          title="Resources"
          description="Start here when you wire systems or walk stakeholders through the flow."
        />

        <div className="glass noise-overlay mt-12 overflow-hidden rounded-2xl md:mt-14">
          <ul className="divide-y divide-[var(--glass-border)]">
            {docs.map((doc) => (
              <li key={doc.title}>
                <a
                  href={doc.href}
                  className="group flex items-start justify-between gap-8 px-6 py-8 transition-colors sm:px-8 md:px-10 md:py-10"
                >
                  <div>
                    <span className="text-lg font-medium text-[var(--text-primary)]">{doc.title}</span>
                    <p className="mt-2 text-base leading-relaxed text-[var(--text-secondary)]">{doc.desc}</p>
                  </div>
                  <ArrowUpRight
                    className="mt-1 h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]"
                    strokeWidth={1.5}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
