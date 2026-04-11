import { Package, MapPin, Battery, Signal, Info } from "lucide-react";
import { shipmentData } from "@/data/mockData";
import { useState } from "react";

export function ShipmentsSection() {
  const [selectedBox, setSelectedBox] = useState<string | null>(null);

  const mapCoordinates: Record<string, { x: string; y: string }> = {
    "BOX-7A12": { x: "45%", y: "30%" },
    "BOX-3K49": { x: "50%", y: "45%" },
    "BOX-9M22": { x: "48%", y: "40%" },
    "BOX-1P87": { x: "80%", y: "60%" },
  };

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

      {/* --- SIMULASI MAPBOX --- */}
      <div className="relative w-full h-[400px] rounded-xl border border-border bg-[#0a0a0a] overflow-hidden group">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Dummy Map Pins */}
        {shipmentData.map((s) => {
          const coords = mapCoordinates[s.boxId] || {
            x: `${Math.random() * 80 + 10}%`,
            y: `${Math.random() * 80 + 10}%`,
          };
          const isSelected = selectedBox === s.boxId;

          return (
            <div
              key={s.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              style={{ left: coords.x, top: coords.y }}
              onClick={() => setSelectedBox(isSelected ? null : s.boxId)}>
              {/* Ping Animation */}
              <div
                className={`absolute inset-0 rounded-full animate-ping opacity-75 ${s.status === "healthy" ? "bg-primary" : s.status === "warning" ? "bg-warning" : "bg-destructive"}`}></div>
              {/* Dot */}
              <div
                className={`relative h-4 w-4 rounded-full border-2 border-background shadow-lg transition-transform ${isSelected ? "scale-150" : "scale-100"} ${s.status === "healthy" ? "bg-primary" : s.status === "warning" ? "bg-warning" : "bg-destructive"}`}></div>

              {/* Popup Info (Tooltip Peta) */}
              {isSelected && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-card border border-border rounded-lg shadow-xl text-left z-20">
                  <p className="text-xs font-bold text-foreground">{s.boxId}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" /> {s.location}
                  </p>
                  <div className="mt-2 text-[10px] space-y-1">
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Temp:</span>{" "}
                      <span className="font-medium text-foreground">22°C</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Freq:</span>{" "}
                      <span className="font-medium text-foreground">12Hz</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur border border-border px-3 py-2 rounded-lg flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Mapbox Simulation UI
          </span>
        </div>
      </div>

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
