import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const flowSteps = [
  { title: "ESP32 + Frequency/Accel Sensor", note: "Collects shock, frequency, and acceleration data." },
  { title: "MQTT / HTTPS Gateway", note: "Batches features and securely forwards telemetry." },
  { title: "Next.js API Route", note: "Validates payload and prepares inference request." },
  { title: "ONNX AI Inference", note: "Produces risk score, class label, and model hash." },
  { title: "0G Decentralized Storage", note: "Stores immutable event evidence and content CID." },
  { title: "Smart Contract Escrow", note: "Triggers claim and release logic by threshold." },
  { title: "Next.js Dashboard UI", note: "Displays timeline, scores, and immutable proof." },
  { title: "User / Courier / Receiver", note: "QR scan, claim, return, and confirmation flow." },
];

export default function ProjectFlowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        progressRef.current,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: railRef.current,
            start: "top 25%",
            end: "bottom 80%",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        dotRefs.current,
        { scale: 0.55, opacity: 0.35, backgroundColor: "#94a3b8" },
        {
          scale: 1,
          opacity: 1,
          backgroundColor: "#38bdf8",
          stagger: 0.12,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: railRef.current, start: "top 35%", once: true },
        }
      );

      itemRefs.current.forEach((el, idx) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: 22, opacity: 0.35 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: idx * 0.07,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black px-4 py-20 text-white sm:px-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.08),transparent_45%)]" />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-xs font-medium uppercase tracking-widest text-teal-300">System Flow</p>
        <h2 className="mt-3 text-3xl font-medium text-white">How Safetrack works end-to-end</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
          Data flows from ESP32 sensors to AI inference, then to immutable 0G storage and escrow automation. The
          dashboard reflects every step with verifiable evidence for users and logistics teams.
        </p>

        <div
          ref={railRef}
          className="relative mt-10 space-y-5 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-6"
        >
          <div className="absolute bottom-8 left-7.5 top-8 w-[3px] -translate-x-1/2 rounded-full bg-white/15 sm:left-[2.275rem]" />
          <div
            ref={progressRef}
            className="absolute bottom-8 left-7.5 top-8 w-[3px] -translate-x-1/2 rounded-full bg-linear-to-b from-teal-400 via-sky-400 to-teal-400 sm:left-[2.275rem]"
          />

          {flowSteps.map((step, idx) => (
            <div key={step.title} className="group relative pl-12 sm:pl-16">
              <div
                ref={(el) => {
                  dotRefs.current[idx] = el;
                }}
                className="absolute left-3 top-8 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-transparent bg-slate-400 text-xs font-semibold text-white shadow-lg transition-all duration-300 group-hover:bg-linear-to-r group-hover:from-teal-400 group-hover:to-sky-500 group-hover:shadow-[0_0_0_4px_rgba(16,185,129,0.2)] sm:left-[1.15rem]"
              >
                {idx + 1}
              </div>
              <div
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                className="rounded-2xl border border-white/10 bg-black/30 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:border-teal-400/40 group-hover:bg-linear-to-r group-hover:from-teal-400/10 group-hover:to-sky-500/10"
              >
                <p className="text-xs font-semibold text-teal-400">STEP {idx + 1}</p>
                <h3 className="mt-1 text-base font-semibold text-white">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">{step.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
