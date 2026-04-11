"use client";

import { useEffect, useRef } from "react";
import { Brain, FileCheck, MapPin, Shield } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading, FeatureCard } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <MapPin size={36} strokeWidth={3} className="text-black" />,
    title: "REAL-TIME GPS TRACKING",
    description: "See exactly where your package is at every moment, plotted on a live map with route history.",
    color: "#FF6B00",
    bgColor: "bg-[#FFE5CC]",
  },
  {
    icon: <Brain size={36} strokeWidth={3} className="text-black" />,
    title: "AI SAFETY PREDICTION",
    description: "Random Forest model trained on 5000+ samples. 99.98% CV accuracy, ~0.9ms per inference.",
    color: "#00F0FF",
    bgColor: "bg-[#CCF9FF]",
  },
  {
    icon: <Shield size={36} strokeWidth={3} className="text-black" />,
    title: "IMMUTABLE PROOF ON 0G",
    description: "Sensor logs hashed and stored on 0G decentralized storage. Tamper-proof evidence for every claim.",
    color: "#FF0040",
    bgColor: "bg-[#FFCCD6]",
  },
  {
    icon: <FileCheck size={36} strokeWidth={3} className="text-black" />,
    title: "AUTO-CLAIM VIA SMART CONTRACT",
    description:
      "When safety score drops below threshold, smart contract triggers deposit release automatically.",
    color: "#00FF66",
    bgColor: "bg-[#CCFFE0]",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section id="features" ref={sectionRef} className="bg-[#F4F4F4] px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          badge="FEATURES"
          title="EVERYTHING YOU NEED"
          highlight="TO PROTECT YOUR SHIPMENTS"
        />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
