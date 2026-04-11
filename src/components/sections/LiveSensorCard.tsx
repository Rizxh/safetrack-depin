import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PredictionResult, SensorReading } from "@/types/sensor";

gsap.registerPlugin(ScrollTrigger);

const mockSensor: SensorReading = {
  ax: 0.01,
  ay: 0.02,
  az: 1.0,
  shock_freq_hz: 0.3,
  temperature_c: 28.5,
  humidity_pct: 62,
  resultant_g: 1.0,
  delta_g: 0.01,
  inference_ms: 0.9,
};

const mockPrediction: PredictionResult = {
  status: "SAFE",
  safety_score: 94,
  probabilities: { SAFE: 0.94, WARNING: 0.05, DANGER: 0.01 },
  conclusion: {
    summary: "Kondisi paket dalam keadaan AMAN.",
    action: "Tidak diperlukan tindakan khusus.",
  },
};

const statusStyles = {
  SAFE: {
    bg: "bg-[#CCFF00]",
    text: "text-black",
    border: "border-[#000000]",
  },
  WARNING: {
    bg: "bg-[#FFB800]",
    text: "text-black",
    border: "border-[#000000]",
  },
  DANGER: {
    bg: "bg-[#FF3D00]",
    text: "text-white",
    border: "border-[#000000]",
  },
};

export default function LiveSensorCard() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const safeBarRef = useRef<HTMLDivElement>(null);
  const warningBarRef = useRef<HTMLDivElement>(null);
  const dangerBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: cardRef.current, start: "top 85%", once: true },
          onComplete: () => {
            const bars = [
              { ref: safeBarRef, value: mockPrediction.probabilities.SAFE * 100 },
              { ref: warningBarRef, value: mockPrediction.probabilities.WARNING * 100 },
              { ref: dangerBarRef, value: mockPrediction.probabilities.DANGER * 100 },
            ];
            bars.forEach(({ ref, value }, idx) => {
              gsap.fromTo(
                ref.current,
                { width: "0%" },
                { width: `${value}%`, duration: 0.8, delay: idx * 0.1, ease: "power2.out" }
              );
            });
          },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const currentStatus = statusStyles[mockPrediction.status];

  return (
    <section id="live-sensor" ref={sectionRef} className="border-y-4 border-black bg-[#F4F4F4] px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="inline-block border-4 border-black bg-[#FF00FF] px-3 py-1">
            <p className="text-xs font-bold uppercase text-white">LIVE PREVIEW</p>
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-black sm:text-3xl md:text-4xl">
            REAL-TIME
            <br />
            <span className="inline-block border-4 border-black bg-[#2979FF] px-4 py-1 text-white shadow-[4px_4px_0px_#000000]">
              SENSOR DASHBOARD
            </span>
          </h2>
        </div>

        <div
          ref={cardRef}
          className="border-4 border-black bg-white p-8 shadow-[12px_12px_0px_#000000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[10px_10px_0px_#000000]"
        >
          {/* Header */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-6">
            <div>
              <div className="inline-block border-4 border-black bg-[#FFB800] px-3 py-1">
                <p className="text-xs font-black uppercase">SHIP-2024-001</p>
              </div>
              <p className="mt-2 font-display text-3xl font-black">ESP32 SENSOR</p>
            </div>
            <div className="flex items-center gap-3 border-4 border-black bg-[#CCFF00] px-6 py-3 shadow-[6px_6px_0px_#000000]">
              <span className="h-4 w-4 animate-pulse rounded-full bg-black" />
              <span className="text-base font-black uppercase">Live</span>
            </div>
          </div>

          {/* Safety Score */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6 border-b-4 border-black pb-8">
            <div>
              <div className="font-display text-8xl font-black leading-none text-[#CCFF00]">
                {mockPrediction.safety_score}%
              </div>
              <p className="mt-3 text-base font-black uppercase text-black">Safety Score</p>
            </div>
            <div
              className={`border-4 border-black px-8 py-4 text-2xl font-black shadow-[6px_6px_0px_#000000] ${currentStatus.bg} ${currentStatus.text}`}
            >
              {mockPrediction.status}
            </div>
          </div>

          {/* Sensor Metrics Grid */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_#000000]">
              <p className="text-xs font-black uppercase text-black">Shock Freq</p>
              <p className="mt-2 font-heading text-3xl font-black text-black">{mockSensor.shock_freq_hz} <span className="text-lg">Hz</span></p>
            </div>
            <div className="border-4 border-black bg-[#FFE5CC] p-5 shadow-[4px_4px_0px_#000000]">
              <p className="text-xs font-black uppercase text-black">Temperature</p>
              <p className="mt-2 font-heading text-3xl font-black text-black">{mockSensor.temperature_c}°C</p>
            </div>
            <div className="border-4 border-black bg-[#CCF9FF] p-5 shadow-[4px_4px_0px_#000000]">
              <p className="text-xs font-black uppercase text-black">Humidity</p>
              <p className="mt-2 font-heading text-3xl font-black text-black">{mockSensor.humidity_pct}%</p>
            </div>
            <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_#000000]">
              <p className="text-xs font-black uppercase text-black">G-force X</p>
              <p className="mt-2 font-heading text-3xl font-black text-black">{mockSensor.ax.toFixed(2)}</p>
            </div>
            <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_#000000]">
              <p className="text-xs font-black uppercase text-black">G-force Z</p>
              <p className="mt-2 font-heading text-3xl font-black text-black">{mockSensor.az.toFixed(2)}</p>
            </div>
            <div className="border-4 border-black bg-[#CCFFE0] p-5 shadow-[4px_4px_0px_#000000]">
              <p className="text-xs font-black uppercase text-black">AI Inference</p>
              <p className="mt-2 font-heading text-3xl font-black text-black">{mockSensor.inference_ms} <span className="text-lg">ms</span></p>
            </div>
          </div>

          {/* Probability Bars */}
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-base font-black text-black">
                <span>P(SAFE)</span>
                <span className="border-4 border-black bg-[#CCFF00] px-3 py-1 text-black">{Math.round(mockPrediction.probabilities.SAFE * 100)}%</span>
              </div>
              <div className="h-8 border-4 border-black bg-white shadow-[4px_4px_0px_#000000]">
                <div
                  ref={safeBarRef}
                  className="h-full bg-[#CCFF00] transition-all"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-base font-black text-black">
                <span>P(WARNING)</span>
                <span className="border-4 border-black bg-[#FFB800] px-3 py-1 text-black">{Math.round(mockPrediction.probabilities.WARNING * 100)}%</span>
              </div>
              <div className="h-8 border-4 border-black bg-white shadow-[4px_4px_0px_#000000]">
                <div
                  ref={warningBarRef}
                  className="h-full bg-[#FFB800] transition-all"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-base font-black text-black">
                <span>P(DANGER)</span>
                <span className="border-4 border-black bg-[#FF3D00] px-3 py-1 text-white">{Math.round(mockPrediction.probabilities.DANGER * 100)}%</span>
              </div>
              <div className="h-8 border-4 border-black bg-white shadow-[4px_4px_0px_#000000]">
                <div
                  ref={dangerBarRef}
                  className="h-full bg-[#FF3D00] transition-all"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
