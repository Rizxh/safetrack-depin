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
    <section
      id="docs"
      className="relative overflow-hidden bg-black px-4 pb-20 pt-8 text-white sm:px-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.06),transparent_50%)]" />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-xs font-medium uppercase tracking-widest text-teal-300">Docs</p>
        <h2 className="mt-3 text-3xl font-medium text-white">Developer resources and product guides</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {docs.map((doc) => (
            <a
              key={doc.title}
              href={doc.href}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:border-teal-400/40"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-base font-medium text-white">{doc.title}</h3>
                <ArrowUpRight className="h-4 w-4 text-zinc-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal-400" />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{doc.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
