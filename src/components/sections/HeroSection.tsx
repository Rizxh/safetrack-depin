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
      className="landing-section-x relative flex min-h-dvh flex-col justify-center overflow-visible scroll-mt-28 py-24 text-center sm:py-28 lg:py-24 xl:py-28"
    >
      {/* Ambient blobs */}
      <div
        className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] opacity-10 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-[var(--accent-mint)] opacity-[0.1] blur-[100px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2 lg:items-center lg:gap-20 lg:text-left xl:gap-24">
        <div className="relative z-10 order-2 flex flex-col items-center lg:order-1 lg:items-start">
          <div
            ref={badgeRef}
            className="glass noise-overlay relative mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-[var(--text-secondary)]"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            DePIN · 0G · On-device AI
          </div>

          <h1
            ref={h1Ref}
            className="text-4xl font-bold leading-[1.12] tracking-tight text-[var(--text-primary)] sm:text-5xl md:text-6xl lg:text-[2.75rem] lg:leading-[1.1] xl:text-7xl"
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

        {/* 3D — z-20; tinggi sedikit lebih kecil dari versi besar, tetap nyaman (bukan “mini”) */}
        <div className="relative z-20 order-1 mx-auto flex w-full min-w-0 min-h-[min(380px,52vh)] max-w-[min(100%,520px)] items-center justify-center overflow-visible max-lg:pt-2 lg:order-2 lg:mx-0 lg:max-w-none lg:min-h-[min(600px,72vh)] lg:justify-end lg:pr-2 lg:pt-0 xl:pr-0">
          <ThreeScene className="block h-[min(460px,58vh)] w-full min-h-[340px] overflow-visible lg:h-[min(600px,72vh)] lg:min-h-[420px]" />
        </div>
      </div>
    </section>
  );
}
