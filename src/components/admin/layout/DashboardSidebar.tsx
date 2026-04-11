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
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "shipments", label: "Active Shipments", icon: Package },
  { id: "sensors", label: "Sensor Nodes", icon: Radio },
  { id: "lifecycle", label: "Device Lifecycle", icon: RefreshCcw },
  { id: "thresholds", label: "G-Force Thresholds", icon: AlertTriangle },
  { id: "integrity", label: "0G Data Integrity", icon: Shield },
  { id: "predictions", label: "AI Predictions (Mirofish)", icon: Brain },
  { id: "incidents", label: "Incident Reports", icon: FileWarning },
  { id: "claims", label: "Claims & Escrow", icon: Scale },
  { id: "settings", label: "Settings & API Keys", icon: Settings },
];

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
          <Shield className="h-4 w-4 text-green-400" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white-500">SafeTrack</h1>
          <span className="text-[10px] font-medium tracking-wider text-green-400/80 uppercase">
            DePIN
          </span>
        </div>
        <button
          onClick={onMobileClose}
          className="ml-auto lg:hidden p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}>
              <item.icon
                className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-green-500" : ""}`}
              />
              <span className="truncate">{item.label}</span>
            </button>
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
