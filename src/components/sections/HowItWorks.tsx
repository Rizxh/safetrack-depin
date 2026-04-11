import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: "Attach the device",
    description:
      "Clip our ESP32 sensor inside the package. It reads shock, temperature, and humidity every second.",
  },
  {
    title: "AI monitors in real-time",
    description:
      "Our ML model predicts safety score continuously. Alerts fire the moment anomalies are detected.",
  },
  {
    title: "Claim with proof",
    description:
      "Every event is stored on 0G Network - immutable, verifiable. File claims backed by tamper-proof data.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative overflow-hidden bg-black px-4 py-20 text-white sm:px-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.12),transparent_38%)]" />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-xs font-medium uppercase tracking-widest text-teal-300">HOW IT WORKS</p>
        <h2 className="mt-3 text-3xl font-medium text-white">Three steps to full shipment confidence</h2>
        <p className="mt-2 text-sm text-zinc-400">From hardware to dashboard in minutes.</p>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-[linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0)),linear-gradient(90deg,#22c55e,#06b6d4)] hover:[background-clip:padding-box,border-box] hover:shadow-[0_12px_30px_rgba(6,182,212,0.2)]"
            >
              <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full border border-teal-400 text-sm font-medium text-teal-300 transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-zinc-900">
                {idx + 1}
              </div>
              <h3 className="text-base font-medium text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
