import { ArrowUpRight } from "lucide-react";

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
    <section id="docs" className="scroll-mt-28 border-t border-[var(--glass-border)]/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">Docs</p>
        <h2 className="mt-5 text-3xl font-semibold leading-[1.2] tracking-tight text-[var(--text-primary)] md:text-4xl">
          Resources
        </h2>

        <ul className="mt-12 divide-y divide-[var(--glass-border)] border-t border-[var(--glass-border)] md:mt-14">
          {docs.map((doc) => (
            <li key={doc.title}>
              <a
                href={doc.href}
                className="group flex items-start justify-between gap-8 py-8 transition-colors md:py-10"
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
    </section>
  );
}
