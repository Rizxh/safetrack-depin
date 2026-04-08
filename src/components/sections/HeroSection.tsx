import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface HeroSectionProps {
  ThreeScene: React.ComponentType<{ className?: string }>;
}

export default function HeroSection({ ThreeScene }: HeroSectionProps) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [badgeRef.current, h1Ref.current, subRef.current, btnRef.current],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.7, ease: "power2.out", delay: 0.2 }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="mx-auto grid max-w-6xl gap-8 px-4 lg:min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center pb-16 pt-32">
        <div
          ref={badgeRef}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs text-teal-800"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400" />
          Powered by 0G Network &amp; AI
        </div>
        <h1 ref={h1Ref} className="mt-6 text-5xl font-medium leading-tight text-ink-primary lg:text-6xl">
          Know if your package arrived <span className="text-teal-400">safe.</span>
        </h1>
        <p ref={subRef} className="mt-5 max-w-md text-base leading-relaxed text-ink-secondary">
          Smart IoT sensor + AI prediction that monitors every bump, temperature spike, and shock - in real-time,
          on-chain.
        </p>
        <div ref={btnRef} className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-lg bg-teal-400 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-600">
            Start tracking
          </button>
          <button className="rounded-lg border border-ink-muted/30 px-6 py-3 text-sm text-ink-secondary transition-colors hover:border-teal-400">
            See live demo
          </button>
        </div>
      </div>
      <div className="h-[500px] lg:h-auto">
        <ThreeScene className="h-full w-full" />
      </div>
    </section>
  );
}
