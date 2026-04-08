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
  SAFE: "border-teal-200 bg-teal-50 text-teal-800",
  WARNING: "border-amber-200 bg-amber-50 text-amber-800",
  DANGER: "border-red-200 bg-red-50 text-red-800",
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

  return (
    <section ref={sectionRef} className="px-4 py-16">
      <div ref={cardRef} className="mx-auto max-w-3xl rounded-2xl border border-ink-muted/20 bg-surface-secondary p-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-ink-secondary">Live sensor preview - SHIP-2024-001</p>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-xs text-teal-800">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400" />
            Live
          </div>
        </div>

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="text-6xl font-medium text-teal-400">{mockPrediction.safety_score}%</div>
            <p className="mt-1 text-xs text-ink-muted">Safety score</p>
          </div>
          <div
            className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[mockPrediction.status]}`}
          >
            {mockPrediction.status}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-ink-muted/10 bg-surface-primary p-3">
            <p className="text-xs text-ink-muted">Shock freq</p>
            <p className="mt-1 text-sm text-ink-primary">{mockSensor.shock_freq_hz} Hz</p>
          </div>
          <div className="rounded-xl border border-ink-muted/10 bg-surface-primary p-3">
            <p className="text-xs text-ink-muted">Temperature</p>
            <p className="mt-1 text-sm text-ink-primary">{mockSensor.temperature_c} C</p>
          </div>
          <div className="rounded-xl border border-ink-muted/10 bg-surface-primary p-3">
            <p className="text-xs text-ink-muted">Humidity</p>
            <p className="mt-1 text-sm text-ink-primary">{mockSensor.humidity_pct}%</p>
          </div>
          <div className="rounded-xl border border-ink-muted/10 bg-surface-primary p-3">
            <p className="text-xs text-ink-muted">G-force X</p>
            <p className="mt-1 text-sm text-ink-primary">{mockSensor.ax.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-ink-muted/10 bg-surface-primary p-3">
            <p className="text-xs text-ink-muted">G-force Z</p>
            <p className="mt-1 text-sm text-ink-primary">{mockSensor.az.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-ink-muted/10 bg-surface-primary p-3">
            <p className="text-xs text-ink-muted">AI inference</p>
            <p className="mt-1 text-sm text-ink-primary">{mockSensor.inference_ms} ms</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-ink-secondary">
              <span>P(SAFE)</span>
              <span>{Math.round(mockPrediction.probabilities.SAFE * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full border border-ink-muted/10 bg-surface-primary">
              <div ref={safeBarRef} className="h-full rounded-full bg-teal-400" style={{ width: "0%" }} />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-ink-secondary">
              <span>P(WARNING)</span>
              <span>{Math.round(mockPrediction.probabilities.WARNING * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full border border-ink-muted/10 bg-surface-primary">
              <div ref={warningBarRef} className="h-full rounded-full" style={{ width: "0%", background: "#EF9F27" }} />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-ink-secondary">
              <span>P(DANGER)</span>
              <span>{Math.round(mockPrediction.probabilities.DANGER * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full border border-ink-muted/10 bg-surface-primary">
              <div ref={dangerBarRef} className="h-full rounded-full" style={{ width: "0%", background: "#E24B4A" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
