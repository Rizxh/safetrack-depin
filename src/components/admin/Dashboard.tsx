"use client";

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
import { RouteTrackingSection } from "./views/RouteTrackingSection";
import { MonthlyReportSection } from "./views/MonthlyReportSection";
import { AIChatbot } from "./AIChatbot";
import Link from "next/link";
import { ArrowLeft, Menu } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
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
      case "route-tracking":
        return <RouteTrackingSection />;
      case "monthly-report":
        return <MonthlyReportSection />;
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
      predictions: "AI Predictions",
      claims: "Claims & Escrow",
      settings: "Settings & Integrations",
      "route-tracking": "Route Tracking & AI Analysis",
      "monthly-report": "Laporan Bulanan AI",
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
        <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20 px-4 lg:px-6 flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden shrink-0"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="shrink-0 gap-1.5 px-2 text-muted-foreground hover:text-foreground" asChild>
              <Link href="/" aria-label="Kembali ke beranda">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Beranda</span>
              </Link>
            </Button>
            <h2 className="min-w-0 text-sm font-semibold tracking-tight truncate">
              {getSectionTitle()}
            </h2>
          </div>

          <div className="shrink-0 scale-90 sm:scale-100 [&_button]:max-h-9">
            <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
          </div>
        </header>

        {/* Konten Utama */}
        <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
          {renderSection()}
        </main>
      </div>

      <AIChatbot onNavigate={setActiveSection} />
    </div>
  );
}
