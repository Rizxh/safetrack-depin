import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does Safetrack detect package damage?",
    a: "ESP32 sensors capture shock, temperature, and humidity. The model scores anomalies in near real time.",
  },
  {
    q: "Is shipment data tamper-proof?",
    a: "Critical events are hashed and stored on 0G—auditable when you need proof.",
  },
  {
    q: "Can logistics companies integrate?",
    a: "Yes. REST APIs and webhooks for fleet and OMS systems.",
  },
  {
    q: "What happens when risk is detected?",
    a: "The dashboard surfaces warnings and can drive workflows, including escrow logic.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faqs" className="scroll-mt-28 border-t border-[var(--glass-border)]/40 py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">FAQ</p>
        <h2 className="mt-5 text-3xl font-semibold leading-[1.2] tracking-tight text-[var(--text-primary)] md:text-4xl">
          Common questions
        </h2>

        <div className="mt-12 space-y-0 divide-y divide-[var(--glass-border)] border-t border-[var(--glass-border)] md:mt-14">
          {faqs.map((item, idx) => (
            <div key={item.q} className="py-8 first:pt-8">
              <button
                type="button"
                className="flex w-full items-start justify-between gap-6 text-left"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                <span className="text-base font-normal leading-snug text-[var(--text-primary)] md:text-[17px]">
                  {item.q}
                </span>
                <ChevronDown
                  className={`mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform ${open === idx ? "rotate-180" : ""}`}
                  strokeWidth={1.5}
                />
              </button>
              {open === idx && (
                <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
