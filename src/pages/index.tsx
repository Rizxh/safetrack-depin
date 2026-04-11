import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import LiveSensorCard from "@/components/sections/LiveSensorCard";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import Stats from "@/components/sections/Stats";
import Pricing from "@/components/sections/Pricing";

const ThreeScene = dynamic(() => import("@/components/three/ThreeScene"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-transparent" />,
});

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection ThreeScene={ThreeScene} />
      <LiveSensorCard />
      <HowItWorks />
      <Features />
      <Stats />
      <Pricing />
      <Footer />
    </main>
  );
}
