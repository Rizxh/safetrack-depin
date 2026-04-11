import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface HeroSectionProps {
  ThreeScene: React.ComponentType<{ className?: string }>;
}

export default function HeroSection({ ThreeScene }: HeroSectionProps) {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [badgeRef.current, h1Ref.current, subRef.current, ctaRef.current],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out", delay: 0.05 }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-4 pb-16 pt-28 text-center lg:pt-24"
    >
      {/* Ambient blobs */}
      <div
        className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] opacity-10 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-purple-600 opacity-[0.08] blur-[100px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16 lg:text-left">
        <div className="flex flex-col items-center lg:items-start">
          <div
            ref={badgeRef}
            className="glass noise-overlay relative mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-[var(--text-secondary)]"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            DePIN · 0G · On-device AI
          </div>

          <h1
            ref={h1Ref}
            className="text-5xl font-bold leading-[1.1] tracking-tight text-[var(--text-primary)] md:text-6xl lg:text-7xl"
          >
            Shipment clarity, without the noise.
          </h1>

          <p
            ref={subRef}
            className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--text-secondary)] lg:mx-0"
          >
            Sensors, risk scores, and proofs in one calm view—built for teams who care about what happens in
            transit.
          </p>

          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <button
              type="button"
              className="rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Start tracking
            </button>
            <button
              type="button"
              className="glass rounded-xl px-6 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              Live demo →
            </button>
          </div>
        </div>

        {/* GLASS SURFACE — 3D preview */}
        <div className="noise-overlay glass-strong relative mx-auto h-[min(420px,50vh)] w-full max-w-lg overflow-hidden rounded-2xl p-3 glow-accent lg:mx-0 lg:h-[min(520px,65vh)] lg:max-w-none">
          <ThreeScene className="h-full w-full opacity-95" />
        </div>
      </div>
    </section>
  );
}
