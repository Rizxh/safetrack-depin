import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          stagger: 0.06,
          duration: 0.45,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="scroll-mt-28 border-t border-[var(--glass-border)]/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">Features</p>
        <h2 className="mt-5 max-w-2xl text-3xl font-semibold leading-[1.2] tracking-tight text-[var(--text-primary)] md:text-4xl">
          Focused tools—not a feature warehouse.
        </h2>

        <ul className="mt-14 divide-y divide-[var(--glass-border)] border-t border-[var(--glass-border)] md:mt-16">
          {features.map((feature, idx) => (
            <li
              key={feature.title}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              className="grid gap-4 py-10 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-16 sm:py-12"
            >
              <span className="text-lg font-medium text-[var(--text-primary)]">{feature.title}</span>
              <span className="text-base leading-[1.7] text-[var(--text-secondary)]">{feature.line}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
