import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
  loading: () => <div className="h-full w-full bg-transparent" />,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <HeroSection ThreeScene={ThreeScene} />
      <LiveSensorCard />
      <HowItWorks />
      <Features />
      <ProjectFlowSection />
      <FaqSection />
      <ContactSection />
      <DocsSection />
      <Footer />
    </main>
  );
}
