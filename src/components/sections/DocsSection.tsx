import { ArrowUpRight } from "lucide-react";

const docs = [
  {
    title: "Project Overview",
    desc: "Read the product context, dashboard concept, and architecture overview.",
    href: "#about",
  },
  {
    title: "API Reference",
    desc: "Integrate telemetry ingestion, risk scoring, and claim webhooks.",
    href: "#contact-us",
  },
  {
    title: "Escrow & Claim Flow",
    desc: "Understand how model risk and immutable CIDs trigger settlement.",
    href: "#docs",
  },
];

export default function DocsSection() {
  return (
    <section id="docs" className="px-4 pb-20 pt-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-medium uppercase tracking-widest text-teal-400">Docs</p>
        <h2 className="mt-3 text-3xl font-medium text-ink-primary">Developer resources and product guides</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {docs.map((doc) => (
            <a
              key={doc.title}
              href={doc.href}
              className="group rounded-2xl border border-ink-muted/15 p-5 transition-colors hover:border-teal-300"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-base font-medium text-ink-primary">{doc.title}</h3>
                <ArrowUpRight className="h-4 w-4 text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{doc.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
