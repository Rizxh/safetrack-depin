import {
  LayoutDashboard,
  Package,
  Radio,
  AlertTriangle,
  Shield,
  FileWarning,
  Brain,
  Settings,
  X,
  Scale,
  RefreshCcw,
  Route,
  FileBarChart2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  group?: string;
}

const navItems: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, group: "main" },
  { id: "shipments", label: "Active Shipments", icon: Package, group: "main" },
  { id: "route-tracking", label: "Route Tracking AI", icon: Route, badge: "AI", group: "ai" },
  { id: "monthly-report", label: "Laporan Bulanan AI", icon: FileBarChart2, badge: "AI", group: "ai" },
  { id: "predictions", label: "AI Predictions", icon: Sparkles, badge: "AI", group: "ai" },
  { id: "incidents", label: "Incident Reports", icon: FileWarning, group: "ops" },
  { id: "integrity", label: "0G Data Integrity", icon: Shield, group: "ops" },
  { id: "claims", label: "Claims & Escrow", icon: Scale, group: "ops" },
  { id: "sensors", label: "Sensor Nodes", icon: Radio, group: "config" },
  { id: "lifecycle", label: "Device Lifecycle", icon: RefreshCcw, group: "config" },
  { id: "thresholds", label: "G-Force Thresholds", icon: AlertTriangle, group: "config" },
  { id: "settings", label: "Settings & API Keys", icon: Settings, group: "config" },
];

const groupLabels: Record<string, string> = {
  main: "Utama",
  ai: "Gemini AI",
  ops: "Operasional",
  config: "Konfigurasi",
};

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function DashboardSidebar({
  activeSection,
  onSectionChange,
  mobileOpen,
  onMobileClose,
}: DashboardSidebarProps) {
  const handleClick = (id: string) => {
    onSectionChange(id);
    onMobileClose();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-6 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/15">
          <Image
            src="/icon.png"
            alt="SafeTrack"
            width={32}
            height={32}
          />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white-500">SafeTrack</h1>
          <span className="text-[10px] font-medium leading-tight text-green-400/90">Depin Logistic System</span>
        </div>
        <button
          onClick={onMobileClose}
          className="ml-auto lg:hidden p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-4">
        {(["main", "ai", "ops", "config"] as const).map((group) => {
          const items = navItems.filter((i) => i.group === group);
          if (!items.length) return null;
          return (
            <div key={group}>
              <p className="px-3 mb-1 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                {groupLabels[group]}
              </p>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive = activeSection === item.id;
                  const isAI = item.badge === "AI";
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                        isActive
                          ? "bg-secondary text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <item.icon
                        className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-green-500" : isAI ? "text-primary/60" : ""}`}
                      />
                      <span className="truncate flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${isActive ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary/70"}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse-glow" />
          <span className="text-xs text-muted-foreground">
            0G Network: Connected
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-sidebar border-r border-border z-30">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-sidebar border-r border-border z-50">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
