import { Package, MapPin, Battery, Signal } from "lucide-react";
import { shipmentData } from "@/data/mockData";
import { useState } from "react";
import { MapLibreMap } from "./MapLibreMap";

export function ShipmentsSection() {
  const [selectedBox, setSelectedBox] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Live Tracking Map
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time geolocation mapping and telemetry
        </p>
      </div>

      {/* MapLibre GL Map */}
      <MapLibreMap
        shipments={shipmentData}
        selectedBox={selectedBox}
        onBoxSelect={setSelectedBox}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shipmentData.map((s) => (
          <div
            key={s.id}
            className={`rounded-xl border bg-card p-5 transition-all cursor-pointer ${selectedBox === s.boxId ? "border-primary/50 shadow-md bg-secondary/20" : "border-border hover:border-primary/20"}`}
            onClick={() => setSelectedBox(s.boxId)}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${s.status === "healthy" ? "bg-primary/15" : s.status === "warning" ? "bg-warning/15" : "bg-destructive/15"}`}>
                  <Package
                    className={`h-5 w-5 ${s.status === "healthy" ? "text-primary" : s.status === "warning" ? "text-warning" : "text-destructive"}`}
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{s.boxId}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {s.location}
                    </span>
                  </div>
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium capitalize shrink-0 ${s.status === "healthy" ? "bg-primary/15 text-primary" : s.status === "warning" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"}`}>
                {s.status}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">G-Force</p>
                <p
                  className={`text-sm font-semibold ${s.gForcePeak > 5 ? "text-destructive" : "text-foreground"}`}>
                  {s.gForcePeak.toFixed(1)}g
                </p>
              </div>
              <div className="text-center flex flex-col items-center">
                <Battery className="h-3 w-3 text-muted-foreground mb-0.5" />
                <p className="text-sm font-semibold text-foreground">
                  {s.battery}%
                </p>
              </div>
              <div className="text-center flex flex-col items-center">
                <Signal className="h-3 w-3 text-muted-foreground mb-0.5" />
                <p className="text-sm font-semibold text-foreground">
                  {s.signalStrength}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
