import { useEffect, useRef } from "react";
import { Brain, FileCheck, MapPin, Shield } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: MapPin,
    iconWrapClass: "bg-teal-50",
    iconClass: "text-teal-600",
    title: "Real-time GPS tracking",
    description: "See exactly where your package is at every moment, plotted on a live map with route history.",
  },
  {
    icon: Brain,
    iconWrapClass: "bg-[#E6F1FB]",
    iconClass: "text-[#185FA5]",
    title: "AI safety prediction",
    description: "Random Forest model trained on 5000+ samples. 99.98% CV accuracy, ~0.9ms per inference.",
  },
  {
    icon: Shield,
    iconWrapClass: "bg-[#FAECE7]",
    iconClass: "text-[#993C1D]",
    title: "Immutable proof on 0G",
    description: "Sensor logs hashed and stored on 0G decentralized storage. Tamper-proof evidence for every claim.",
  },
  {
    icon: FileCheck,
    iconWrapClass: "bg-[#EEEDFE]",
    iconClass: "text-[#534AB7]",
    title: "Auto-claim via smart contract",
    description:
      "When safety score drops below threshold, smart contract triggers deposit release automatically.",
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
    <section id="features" ref={sectionRef} className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-medium uppercase tracking-widest text-teal-400">FEATURES</p>
        <h2 className="mt-3 text-3xl font-medium text-ink-primary">Everything you need to protect what you ship</h2>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                className="rounded-2xl border border-ink-muted/10 bg-surface-secondary p-5 transition-colors duration-200 hover:border-teal-200"
              >
                <div className={`mb-4 flex h-8 w-8 items-center justify-center rounded-lg ${feature.iconWrapClass}`}>
                  <Icon size={16} className={feature.iconClass} />
                </div>
                <h3 className="text-base font-medium text-ink-primary">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
