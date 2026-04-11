"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading, StepCard } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "ATTACH THE DEVICE",
    description:
      "Clip our ESP32 sensor inside the package. It reads shock, temperature, and humidity every second.",
    color: "#FF6B00",
    bgColor: "bg-[#FFE5CC]",
  },
  {
    number: "02",
    title: "AI MONITORS IN REAL-TIME",
    description:
      "Our ML model predicts safety score continuously. Alerts fire the moment anomalies are detected.",
    color: "#00F0FF",
    bgColor: "bg-[#CCF9FF]",
  },
  {
    number: "03",
    title: "CLAIM WITH PROOF",
    description:
      "Every event is stored on 0G Network - immutable, verifiable. File claims backed by tamper-proof data.",
    color: "#00FF66",
    bgColor: "bg-[#CCFFE0]",
  },
];

export default function HowItWorks() {
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
          stagger: 0.2,
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
    <section id="how-it-works" ref={sectionRef} className="border-y-4 border-black bg-white px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          badge="HOW IT WORKS"
          title="THREE STEPS TO"
          highlight="FULL CONFIDENCE"
          description="From hardware to dashboard in minutes."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
            >
              <StepCard {...step} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
