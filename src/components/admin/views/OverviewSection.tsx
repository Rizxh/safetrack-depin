import { MetricCard } from "../MetricCard";
import { GForceChart } from "../GForceChart";
import { ShipmentTable } from "../ShipmentTable";
import { shipmentData } from "@/data/mockData";

export function OverviewSection() {
  const avgBattery = Math.round(shipmentData.reduce((s, r) => s + r.battery, 0) / shipmentData.length);
  const avgSignal = Math.round(shipmentData.reduce((s, r) => s + r.signalStrength, 0) / shipmentData.length);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">Real-time logistics intelligence powered by DePIN</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Shipment Health" value="Healthy" status="healthy" subtitle="8/10 shipments nominal">
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs text-muted-foreground">Mirofish AI analyzing g-force patterns</span>
          </div>
        </MetricCard>

        <MetricCard title="Data Integrity" value="Verified" status="verified" subtitle="Last sync: 2 min ago">
          <div className="mt-3">
            <code className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">
              0x3f8a...9e0f
            </code>
          </div>
        </MetricCard>

        <MetricCard title="Sensor Stats" value={`${avgBattery}% / ${avgSignal}%`} subtitle="Avg Battery / Signal">
          <div className="mt-3 flex gap-3">
            <div className="flex-1">
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: `${avgBattery}%` }} />
              </div>
            </div>
            <div className="flex-1">
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-accent" style={{ width: `${avgSignal}%` }} />
              </div>
            </div>
          </div>
        </MetricCard>
      </div>

      <GForceChart />
      <ShipmentTable />
    </div>
  );
}
