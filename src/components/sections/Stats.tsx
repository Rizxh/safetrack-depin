import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "99.98", suffix: "%", label: "Model accuracy" },
  { value: "0.9", suffix: "ms", label: "Inference speed" },
  { value: "6", suffix: "", label: "Sensors monitored" },
  { value: "0G", suffix: "", label: "Decentralized storage" },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const valueRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    <section id="stats" ref={sectionRef} className="bg-surface-secondary px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-medium text-ink-primary">Numbers that matter</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((item, idx) => (
            <div
              key={item.label}
              className="rounded-2xl border border-ink-muted/10 bg-surface-primary p-6 text-center"
            >
              <div
                ref={(el) => {
                  valueRefs.current[idx] = el;
                }}
                className="text-3xl font-medium text-teal-400"
              >
                {item.value}
                {item.value === "0G" ? "" : item.suffix}
              </div>
              <p className="mt-1 text-xs text-ink-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
