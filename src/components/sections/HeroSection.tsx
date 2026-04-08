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
    <section
      id="home"
      ref={sectionRef}
      className="relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(29,158,117,0.24),transparent_40%),radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.26),transparent_38%),linear-gradient(120deg,#030712_15%,#041c30_55%,#05251e_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(3,7,18,0.2),rgba(3,7,18,0.75))]" />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center pb-16 pt-32 lg:pt-28">
        <div
          ref={badgeRef}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-200/70 bg-white/15 px-3 py-1 text-xs text-teal-100 backdrop-blur-md"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400" />
          Powered by 0G Network &amp; AI
        </div>
        <h1 ref={h1Ref} className="mt-6 text-4xl font-medium leading-tight text-white sm:text-5xl lg:text-6xl">
          Know if your package arrived <span className="text-teal-300">safe.</span>
        </h1>
        <p ref={subRef} className="mt-5 max-w-md text-base leading-relaxed text-slate-200">
          Smart IoT sensor + AI prediction that monitors every bump, temperature spike, and shock - in real-time,
          on-chain.
        </p>
        <div ref={btnRef} className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-xl bg-linear-to-r from-teal-400 to-blue-500 px-6 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-[1.02]">
            Start tracking
          </button>
          <button className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm text-slate-100 transition-colors hover:border-teal-300">
            See live demo
          </button>
        </div>
      </div>
      <div className="h-[340px] sm:h-[420px] md:h-[480px] lg:h-auto">
        <ThreeScene className="h-full w-full drop-shadow-[0_30px_80px_rgba(16,185,129,0.22)]" />
      </div>
      </div>
      {/* <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white to-transparent" /> */}
    </section>
  );
}
