import { useState, useEffect } from "react";
import { FileWarning, MapPin, Clock } from "lucide-react";
import { shipmentData } from "@/data/mockData";

export function IncidentsSection() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const incidents = shipmentData.filter((s) => s.status !== "healthy");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Incident Reports
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Detailed list of flagged shipments and damages
        </p>
      </div>

      {incidents.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <FileWarning className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium">No incidents reported</p>
          <p className="text-sm text-muted-foreground mt-1">
            All shipments are operating within normal parameters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map((s) => (
            <div
              key={s.id}
              className={`rounded-xl border bg-card p-5 ${s.status === "critical" ? "border-destructive/30" : "border-warning/30"}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.status === "critical" ? "bg-destructive/15" : "bg-warning/15"}`}>
                    <FileWarning
                      className={`h-5 w-5 ${s.status === "critical" ? "text-destructive" : "text-warning"}`}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{s.boxId}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {s.location}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {isClient
                          ? new Date(s.timestamp).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "--:--"}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${s.status === "critical" ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning"}`}>
                  {s.status}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground">G-Force Peak</p>
                  <p className="text-sm font-semibold text-destructive">
                    {s.gForcePeak.toFixed(1)}g
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    AI Damage Likelihood
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {s.aiDamageLikelihood}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Recommended Action
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {s.status === "critical"
                      ? "Immediate review"
                      : "Visual inspection"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
