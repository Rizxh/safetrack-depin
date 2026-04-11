import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { LandingSectionHeader } from "@/components/layout/LandingSectionHeader";

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
    <section
      id="faqs"
      className="landing-section-x scroll-mt-28 border-t border-[var(--glass-border)]/40 py-24 md:py-28"
    >
      <div className="landing-content">
        <div className="mx-auto max-w-3xl">
          <LandingSectionHeader
            label="FAQ"
            title="Common questions"
            description="Straight answers on sensors, proofs, and how teams adopt Safetrack."
          />

          <div className="glass noise-overlay mt-12 overflow-hidden rounded-2xl md:mt-14">
            <div className="divide-y divide-[var(--glass-border)] px-5 py-2 sm:px-8">
              {faqs.map((item, idx) => (
                <div key={item.q} className="py-7 first:pt-6 last:pb-6 sm:py-8">
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
        </div>
      </div>
    </section>
  );
}
