import { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Real-time GPS tracking",
    points: [
      "Track live route with timestamped checkpoints.",
      "Monitor delivery drift and unexpected stops.",
      "See courier and receiver status updates in one timeline.",
    ],
  },
  {
    title: "AI safety prediction",
    points: [
      "ONNX model returns risk in milliseconds.",
      "Detects shock patterns and temperature anomalies.",
      "Provides confidence score for claim decisions.",
    ],
  },
  {
    title: "Immutable proof on 0G",
    points: [
      "Sensor records are hashed and anchored to CID.",
      "Evidence remains tamper-proof and auditable.",
      "Supports transparent dispute resolution.",
    ],
  },
  {
    title: "Auto-claim via smart contract",
    points: [
      "Escrow conditions execute automatically.",
      "Claims trigger on verified risk thresholds.",
      "Refund and settlement logic is programmable.",
    ],
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
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
      id="features"
      ref={sectionRef}
      className="relative overflow-hidden bg-black px-4 py-20 text-white sm:px-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(16,185,129,0.1),transparent_42%),radial-gradient(circle_at_15%_80%,rgba(59,130,246,0.1),transparent_40%)]" />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-xs font-medium uppercase tracking-widest text-teal-300">FEATURES</p>
        <h2 className="mt-3 text-3xl font-medium text-white">Everything you need to protect what you ship</h2>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors duration-200 hover:border-teal-400/40"
            >
              <h3 className="text-base font-semibold text-white">{feature.title}</h3>
              <ul className="mt-3 space-y-2">
                {feature.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-zinc-400">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
