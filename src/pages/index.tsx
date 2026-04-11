import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/layout/ScrollReveal";
import HeroSection from "@/components/sections/HeroSection";
import LiveSensorCard from "@/components/sections/LiveSensorCard";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import FaqSection from "@/components/sections/FaqSection";
import ContactSection from "@/components/sections/ContactSection";
import DocsSection from "@/components/sections/DocsSection";
import ProjectFlowSection from "@/components/sections/ProjectFlowSection";

const ThreeScene = dynamic(() => import("@/components/three/ThreeScene"), {
  ssr: false,
  loading: () => (
    <div
      className="block h-[min(460px,58vh)] w-full min-h-[340px] bg-transparent lg:h-[min(600px,72vh)] lg:min-h-[420px]"
      aria-hidden
    />
  ),
});

export default function Home() {
  return (
    <main className="landing-root overflow-x-hidden relative min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] selection:bg-[var(--accent-soft)]">
      <div className="landing-hero-base" aria-hidden />
      <div className="landing-hero-aurora" aria-hidden />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-90"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div className="landing-hero-shimmer" aria-hidden />
      <div
        className="landing-top-glow pointer-events-none fixed inset-x-0 top-0 z-60 h-px bg-linear-to-r from-transparent via-[var(--accent)] to-transparent"
        aria-hidden
      />

      <div className="relative z-10">
        <Navbar />
        <HeroSection ThreeScene={ThreeScene} />
        <ScrollReveal>
          <LiveSensorCard />
        </ScrollReveal>
        <ScrollReveal>
          <HowItWorks />
        </ScrollReveal>
        <ScrollReveal>
          <Features />
        </ScrollReveal>
        <ScrollReveal>
          <ProjectFlowSection />
        </ScrollReveal>
        <ScrollReveal>
          <FaqSection />
        </ScrollReveal>
        <ScrollReveal>
          <ContactSection />
        </ScrollReveal>
        <ScrollReveal>
          <DocsSection />
        </ScrollReveal>
        <ScrollReveal>
          <Footer />
        </ScrollReveal>
      </div>
    </main>
  );
}
