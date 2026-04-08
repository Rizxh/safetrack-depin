import { RefreshCcw, QrCode, Truck, Wrench, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const devices = [
  {
    id: "NODE-8A1",
    status: "In-Transit",
    pool: "B2B",
    batteryHealth: "98%",
    nextMaintenance: "Oct 2026",
  },
  {
    id: "NODE-3B2",
    status: "Return Pending",
    pool: "B2C",
    batteryHealth: "82%",
    nextMaintenance: "Jun 2026",
  },
  {
    id: "NODE-9C3",
    status: "Maintenance",
    pool: "B2B",
    batteryHealth: "45%",
    nextMaintenance: "Now",
  },
  {
    id: "NODE-2D4",
    status: "Delivered",
    pool: "B2C",
    batteryHealth: "91%",
    nextMaintenance: "Dec 2026",
  },
];

export function LifecycleSection() {
  const [poolType, setPoolType] = useState<"All" | "B2B" | "B2C">("All");

  const filtered =
    poolType === "All" ? devices : devices.filter((d) => d.pool === poolType);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In-Transit":
        return <Truck className="h-4 w-4 text-primary" />;
      case "Delivered":
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case "Maintenance":
        return <Wrench className="h-4 w-4 text-destructive" />;
      default:
        return <RefreshCcw className="h-4 w-4 text-warning" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Device Lifecycle
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Hardware circulation and deposit tracking
          </p>
        </div>
        <button className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors border border-border">
          <QrCode className="h-4 w-4" />
          Scan QR Handover
        </button>
      </div>

      {/* Toggle B2B / B2C Pool */}
      <div className="flex p-1 bg-secondary/50 rounded-lg w-fit border border-border">
        {["All", "B2B", "B2C"].map((type) => (
          <button
            key={type}
            onClick={() => setPoolType(type as any)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${poolType === type ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {type} Pool
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((device) => (
          <div
            key={device.id}
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-colors flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center shrink-0">
                  {getStatusIcon(device.status)}
                </div>
                <h3 className="font-semibold text-foreground text-sm">
                  {device.id}
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary px-2 py-1 rounded text-muted-foreground">
                {device.pool}
              </span>
            </div>

            <div className="mt-auto space-y-2 pt-4 border-t border-border/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-foreground">
                  {device.status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Batt. Health</span>
                <span
                  className={`font-medium ${device.batteryHealth < "50%" ? "text-destructive" : "text-foreground"}`}>
                  {device.batteryHealth}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
