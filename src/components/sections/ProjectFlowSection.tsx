import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const flowSteps = [
  { title: "ESP32 + sensors", note: "Shock, frequency, acceleration." },
  { title: "Gateway", note: "MQTT / HTTPS batches outbound." },
  { title: "API route", note: "Validate, forward to inference." },
  { title: "ONNX", note: "Score, label, model hash." },
  { title: "0G storage", note: "CID-backed evidence." },
  { title: "Escrow", note: "Threshold-driven settlement." },
  { title: "Dashboard", note: "Timeline and proofs." },
  { title: "Users", note: "Scan, claim, confirm." },
];

export default function ProjectFlowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        progressRef.current,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: railRef.current,
            start: "top 30%",
            end: "bottom 75%",
            scrub: true,
          },
        }
      );

      itemRefs.current.forEach((el, idx) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0.25, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            delay: idx * 0.04,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="flow"
      ref={sectionRef}
      className="scroll-mt-28 border-t border-[var(--glass-border)]/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">System flow</p>
        <h2 className="mt-5 text-3xl font-semibold leading-[1.2] tracking-tight text-[var(--text-primary)] md:text-4xl">
          From sensor to proof, in order.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
          A single pipeline—no extra layers in the story.
        </p>

        <div ref={railRef} className="relative mt-14 max-w-2xl md:mt-16">
          <div className="absolute bottom-0 left-6 top-0 hidden w-px bg-[var(--glass-border)] sm:block" />
          <div
            ref={progressRef}
            className="absolute bottom-0 left-6 top-0 hidden w-px origin-top bg-[var(--accent)] opacity-60 sm:block"
          />

          {flowSteps.map((step, idx) => (
            <div key={step.title} className="flex gap-6 pb-12 last:pb-0 sm:gap-8">
              <div className="flex w-12 shrink-0 justify-center pt-2 sm:justify-center">
                <span className="hidden h-1.5 w-1.5 rounded-full bg-[var(--accent)] ring-4 ring-[var(--bg-base)] sm:block" />
                <span className="text-xs tabular-nums text-[var(--text-muted)] sm:hidden">0{idx + 1}</span>
              </div>
              <div
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                className="min-w-0 flex-1"
              >
                <h3 className="text-lg font-medium text-[var(--text-primary)]">{step.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-[var(--text-secondary)]">{step.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
