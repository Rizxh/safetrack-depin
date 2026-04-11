import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true },
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
      className="scroll-mt-28 border-t border-[var(--glass-border)]/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">How it works</p>
          <h2 className="mt-5 text-3xl font-semibold leading-[1.2] tracking-tight text-[var(--text-primary)] md:text-4xl">
            Three steps. No playbook required.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
            From hardware to dashboard in minutes.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:mt-16 md:grid-cols-3 md:gap-8">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              className="glass flex min-h-[200px] flex-col rounded-2xl p-8 md:min-h-[220px] md:p-9"
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
