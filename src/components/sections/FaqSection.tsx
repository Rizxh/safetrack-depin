import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does Safetrack detect package damage?",
    a: "ESP32 sensors continuously capture shock, temperature, and humidity. Our AI model evaluates anomalies in near real-time and updates safety score instantly.",
  },
  {
    q: "Is shipment data tamper-proof?",
    a: "Yes. Critical events are hashed and stored on decentralized 0G storage, creating immutable proof that can be used for audits and claims.",
  },
  {
    q: "Can logistics companies integrate Safetrack?",
    a: "Yes. We provide REST APIs and webhook events for fleet systems, order management platforms, and customer dashboards.",
  },
  {
    q: "What happens when risk is detected?",
    a: "The dashboard raises warning states and can trigger automatic workflows, including smart-contract-based claim and deposit logic.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section
      id="faqs"
      className="relative overflow-hidden bg-black px-4 py-20 text-white sm:px-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_42%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_40%)]" />
      <div className="relative mx-auto max-w-4xl">
        <p className="text-xs font-medium uppercase tracking-widest text-teal-300">FAQs</p>
        <h2 className="mt-3 text-3xl font-medium text-white">Everything people ask before shipping smarter</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((item, idx) => (
            <div
              key={item.q}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5"
            >
              <button
                className="flex w-full items-center justify-between gap-4 text-left"
                onClick={() => setOpen(open === idx ? -1 : idx)}
              >
                <span className="text-sm font-medium text-white sm:text-base">{item.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${open === idx ? "rotate-180" : ""}`}
                />
              </button>
              {open === idx && <p className="mt-3 text-sm leading-relaxed text-zinc-400">{item.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
