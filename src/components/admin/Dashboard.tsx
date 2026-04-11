import React, { useState, useEffect } from "react";
import { DashboardSidebar } from "./layout/DashboardSidebar";
import { OverviewSection } from "./views/OverviewSection";
import { ShipmentsSection } from "./views/ShipmentsSection";
import { SensorsSection } from "./views/SensorsSection";
import { ThresholdsSection } from "./views/ThresholdsSection";
import { IntegritySection } from "./views/IntegritySection";
import { IncidentsSection } from "./views/IncidentsSection";
import { PredictionsSection } from "./views/PredictionsSection";
import { SettingsSection } from "./views/SettingsSection";
import { ClaimsSection } from "./views/ClaimSection";
import { LifecycleSection } from "./views/LifecycleSection";
import { Menu, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />;
      case "shipments":
        return <ShipmentsSection />;
      case "sensors":
        return <SensorsSection />;
      case "lifecycle":
        return <LifecycleSection />; 
      case "thresholds":
        return <ThresholdsSection />;
      case "integrity":
        return <IntegritySection />;
      case "incidents":
        return <IncidentsSection />;
      case "predictions":
        return <PredictionsSection />;
      case "claims":
        return <ClaimsSection />; 
      case "settings":
        return <SettingsSection />;
      default:
        return <OverviewSection />;
    }
  };

  const getSectionTitle = () => {
    const titles: Record<string, string> = {
      overview: "Dashboard Overview",
      shipments: "Active Shipments",
      sensors: "Sensor Nodes",
      lifecycle: "Device Lifecycle", 
      thresholds: "G-Force Thresholds",
      integrity: "0G Data Integrity",
      incidents: "Incident Reports",
      predictions: "AI Predictions (Mirofish)",
      claims: "Claims & Escrow",
      settings: "Settings & Integrations",
    };
    return titles[activeSection] || "Dashboard";
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Header Dashboard */}
        <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20 px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden shrink-0"
              onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-sm font-semibold tracking-tight truncate">
              {getSectionTitle()}
            </h2>
          </div>

        </header>

        {/* Konten Utama */}
        <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
