"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "99.98", suffix: "%", label: "Model accuracy", color: "#00FF66", bgColor: "bg-[#CCFFE0]" },
  { value: "0.9", suffix: "ms", label: "Inference speed", color: "#00F0FF", bgColor: "bg-[#CCF9FF]" },
  { value: "6", suffix: "", label: "Sensors monitored", color: "#FF6B00", bgColor: "bg-[#FFE5CC]" },
  { value: "0G", suffix: "", label: "Decentralized storage", color: "#8B5CF6", bgColor: "bg-[#E9D5FF]" },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const valueRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
        }
      );

      stats.forEach((item, idx) => {
        const el = valueRefs.current[idx];
        if (!el) return;
        if (item.value === "0G") return;

        const target = Number(item.value);
        const decimals = item.value.includes(".") ? item.value.split(".")[1].length : 0;
        const counter = { val: 0 };

        gsap.to(counter, {
          val: target,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${counter.val.toFixed(decimals)}${item.suffix}`;
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section id="stats" ref={sectionRef} className="border-y-4 border-black bg-white px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          badge="STATS"
          title="NUMBERS THAT"
          highlight="REALLY MATTER"
        />

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((item, idx) => (
            <div
              key={item.label}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              className={`${item.bgColor} border-4 border-black p-4 shadow-[8px_8px_0px_#000000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[6px_6px_0px_#000000]`}
            >
              {/* Color accent top */}
              <div
                className="mb-3 h-2 w-full shadow-[2px_2px_0px_#000000]"
                style={{ backgroundColor: item.color }}
              />

              {/* Value */}
              <div
                ref={(el) => {
                  valueRefs.current[idx] = el;
                }}
                className="font-heading text-3xl font-black leading-none text-black sm:text-4xl"
              >
                {item.value}
                {item.value === "0G" ? "" : item.suffix}
              </div>

              {/* Label */}
              <p className="mt-3 text-xs font-bold uppercase text-black">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
