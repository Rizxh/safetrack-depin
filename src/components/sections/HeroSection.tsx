"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Activity, Cpu, HardDrive, Zap } from "lucide-react";

const mockCIDList = [
  "QmX4j...8K2p",
  "QmZ7q...3L9m",
  "QmN2r...5H8f",
  "QmP9s...1J4k",
  "QmR6t...7D3n",
  "QmW3v...2C7b",
];

export default function HeroSection({ ThreeScene }: { ThreeScene?: React.ComponentType }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [vibrationData, setVibrationData] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = Array.from({ length: 20 }, () => Math.random() * 100);
      setVibrationData(newData);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" }
      );

      gsap.fromTo(
        ".floating-widget",
        { y: 50, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.4,
          ease: "back.out(1.7)",
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative min-h-screen bg-white px-4 py-20 lg:px-8">
      {/* Technical Grid Background */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Hero Title */}
        <div ref={titleRef} className="text-center pt-8 pb-12 lg:pt-16 lg:pb-16">

          {/* 0G Network Status - Centered at Top */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="h-3 w-3 animate-pulse rounded-full bg-[#FF00FF]" />
            <span className="text-xs font-black uppercase tracking-widest border-2 border-black bg-[#CCFF00] px-4 py-2 shadow-[4px_4px_0px_#000000]">
              0G-Network Status: ACTIVE
            </span>
          </div>
          <h1 className="font-display text-4xl font-black leading-none tracking-tight text-black sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="inline-block border-2 border-black px-4 py-2">THE FUTURE OF</span>
            <br className="hidden sm:block" />
            <span className="inline-block mt-3 sm:mt-4 border-2 border-black bg-[#2979FF] px-6 py-3 text-white shadow-[6px_6px_0px_#000000]">
              AUTONOMOUS
            </span>
            <br className="hidden sm:block" />
            <span className="inline-block mt-3 sm:mt-4 text-[#FF3D00]">LOGISTICS</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-sm font-semibold text-black sm:text-base lg:text-lg">
            Real-time ESP32 sensor intelligence • ONNX AI inference • Immutable 0G storage proof
          </p>

          <div ref={ctaRef} className="mt-10">
            <button className="border-4 border-black bg-[#CCFF00] px-10 py-4 text-lg font-black uppercase text-black shadow-[12px_12px_0px_#000000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[10px_10px_0px_#000000] active:translate-x-2 active:translate-y-2 active:shadow-[8px_8px_0px_#000000] sm:text-xl">
              START TRACKING
            </button>
          </div>
        </div>

        {/* Floating Widgets Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
          {/* AI Core Widget */}
          <div className="floating-widget border-4 border-black bg-white p-6 shadow-[8px_8px_0px_#000000]">
            <div className="mb-4 flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-6 w-6 text-[#2979FF]" strokeWidth={3} />
                <h3 className="text-sm font-black uppercase text-black">AI Core</h3>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-[#CCFF00]" strokeWidth={3} />
                <span className="text-xs font-black text-black">ONNX</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-black text-black">
                <span className="uppercase">Inference Wave</span>
                <span className="text-[#2979FF]">0.9ms</span>
              </div>
              <div className="flex h-20 items-end gap-1 border-2 border-black bg-[#F5F5F5] p-2">
                {vibrationData.map((value, idx) => (
                  <div
                    key={idx}
                    className="w-1 bg-[#2979FF] transition-all duration-100"
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-black text-black">
                <Activity className="h-3 w-3 text-[#2979FF]" />
                <span>PREDICTING SAFETY SCORE...</span>
              </div>
            </div>
          </div>

          {/* 3D ESP32 Container */}
          <div className="floating-widget relative border-4 border-black bg-white p-4 shadow-[8px_8px_0px_#000000]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 border-2 border-black bg-[#CCFF00] px-4 py-1 text-xs font-black uppercase shadow-[4px_4px_0px_#000000]">
              LIVE SENSOR FEED
            </div>
            <div className="aspect-square h-64 w-full bg-[#F5F5F5]">
              {ThreeScene && <ThreeScene />}
            </div>
          </div>

          {/* 0G Storage Widget */}
          <div className="floating-widget border-4 border-black bg-white p-6 shadow-[8px_8px_0px_#000000]">
            <div className="mb-4 flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="h-6 w-6 text-[#FF00FF]" strokeWidth={3} />
                <h3 className="text-sm font-black uppercase text-black">0G Storage</h3>
              </div>
              <span className="text-xs font-black text-[#FF00FF]">DECENTRALIZED</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-black">
                <span className="uppercase">Recent CID Hashes</span>
                <span className="text-[#FF00FF]">6 BLOCKS</span>
              </div>
              <div className="max-h-40 overflow-hidden border-2 border-black bg-[#F5F5F5] p-3 font-mono text-xs">
                <div className="space-y-1.5">
                  {mockCIDList.map((cid, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-black text-black">
                      <span className="text-black">{cid}</span>
                      <span className="text-[#CCFF00]">✓ VERIFIED</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center text-xs font-black text-black">
                IMMUTABLE PROOF ON CHAIN
              </div>
            </div>
          </div>
        </div>

        {/* Package Health Speedometer */}
        <div className="floating-widget border-4 border-black bg-white p-6 shadow-[8px_8px_0px_#000000] mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-sm font-black uppercase text-black">Package Health</h3>
              <p className="mt-1 text-xs font-black text-black">Real-time safety monitoring</p>
            </div>

            <div className="flex flex-col xl:flex-row items-center gap-6">
              {/* Speedometer */}
              <div className="relative h-24 w-48">
                <div className="absolute inset-0 rounded-t-full border-4 border-black bg-[#F5F5F5]" />
                <div
                  className="absolute bottom-0 left-0 right-0 h-full rounded-t-full border-4 border-black bg-[#CCFF00]"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 70% 100%, 50% 50%, 30% 100%, 0 100%)",
                  }}
                />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                  <span className="font-display text-4xl font-black text-black">94%</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-2 border-black bg-[#CCFF00] px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
                  SAFE
                </div>
              </div>

              {/* Status Indicators */}
              <div className="space-y-2 text-sm font-black text-black">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 border-2 border-black bg-[#CCFF00]" />
                  <span>SHOCK: NORMAL</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 border-2 border-black bg-[#2979FF]" />
                  <span>TEMP: 28.5°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 border-2 border-black bg-[#FF00FF]" />
                  <span>HUMIDITY: 62%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Flow Visualization */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between gap-2 xl:gap-4 border-y-4 border-black bg-[#F5F5F5] px-4 py-6 xl:px-8">
            <div className="flex-1 border-2 border-black bg-white px-4 py-3 text-center shadow-[4px_4px_0px_#000000] xl:px-6 xl:py-4">
              <div className="text-xs font-black uppercase text-black">Hardware</div>
              <div className="mt-2 font-display text-xl font-black xl:text-2xl">ESP32</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-black xl:w-16" />
              <div className="h-4 w-4 border-2 border-black bg-[#CCFF00]" />
              <div className="h-1 w-8 bg-black xl:w-16" />
            </div>

            <div className="flex-1 border-2 border-black bg-white px-4 py-3 text-center shadow-[4px_4px_0px_#000000] xl:px-6 xl:py-4">
              <div className="text-xs font-black uppercase text-black">Logic</div>
              <div className="mt-2 font-display text-xl font-black text-[#2979FF] xl:text-2xl">AI MODEL</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-black xl:w-16" />
              <div className="h-4 w-4 border-2 border-black bg-[#CCFF00]" />
              <div className="h-1 w-8 bg-black xl:w-16" />
            </div>

            <div className="flex-1 border-2 border-black bg-white px-4 py-3 text-center shadow-[4px_4px_0px_#000000] xl:px-6 xl:py-4">
              <div className="text-xs font-black uppercase text-black">Proof</div>
              <div className="mt-2 font-display text-xl font-black text-[#FF00FF] xl:text-2xl">0G NET</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-black xl:w-16" />
              <div className="h-4 w-4 border-2 border-black bg-[#CCFF00]" />
              <div className="h-1 w-8 bg-black xl:w-16" />
            </div>

            <div className="flex-1 border-2 border-black bg-white px-4 py-3 text-center shadow-[4px_4px_0px_#000000] xl:px-6 xl:py-4">
              <div className="text-xs font-black uppercase text-black">Settlement</div>
              <div className="mt-2 font-display text-xl font-black xl:text-2xl">SMART CONTRACT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
