import { Battery, Signal, Wifi } from "lucide-react";
import { shipmentData } from "@/data/mockData";

export function SensorsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Sensor Nodes</h2>
        <p className="text-sm text-muted-foreground mt-1">Monitor battery levels and signal strength across all nodes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shipmentData.map((s) => (
          <div key={s.id} className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground text-sm">{s.boxId}</span>
              </div>
              <span className={`h-2 w-2 rounded-full ${s.signalStrength > 70 ? "bg-primary" : s.signalStrength > 40 ? "bg-warning" : "bg-destructive"}`} />
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Battery className="h-3 w-3" /> Battery</span>
                  <span className="text-xs font-medium text-foreground">{s.battery}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full ${s.battery > 70 ? "bg-primary" : s.battery > 40 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${s.battery}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Signal className="h-3 w-3" /> Signal</span>
                  <span className="text-xs font-medium text-foreground">{s.signalStrength}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full ${s.signalStrength > 70 ? "bg-primary" : s.signalStrength > 40 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${s.signalStrength}%` }} />
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-3">{s.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
