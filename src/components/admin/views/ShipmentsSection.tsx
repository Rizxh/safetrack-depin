import {
  Package,
  MapPin,
  Battery,
  Signal,
  Activity,
  Cpu,
  Clock,
  Shield,
  X,
} from "lucide-react";
import { shipmentData } from "@/data/mockData";
import { getShipmentLngLat } from "@/data/shipmentCoordinates";
import { useState, useMemo } from "react";
import { MapLibreMap } from "./MapLibreMap";
import { cn } from "@/lib/utils";

function formatTelemetryTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function shortHash(hash: string): string {
  if (hash.length <= 22) return hash;
  return `${hash.slice(0, 12)}…${hash.slice(-8)}`;
}

const statusStyles = {
  healthy: {
    badge:
      "bg-primary/15 text-primary border-primary/20",
    bar: "from-emerald-500 to-teal-600",
  },
  warning: {
    badge:
      "bg-warning/15 text-warning border-warning/20",
    bar: "from-amber-500 to-orange-600",
  },
  critical: {
    badge:
      "bg-destructive/15 text-destructive border-destructive/20",
    bar: "from-red-500 to-rose-700",
  },
} as const;

export function ShipmentsSection() {
  const [selectedBox, setSelectedBox] = useState<string | null>(null);

  const selected = useMemo(
    () => shipmentData.find((s) => s.boxId === selectedBox) ?? null,
    [selectedBox],
  );

  const coords = selectedBox ? getShipmentLngLat(selectedBox) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Active Shipments
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Peta ringkas di atas; kondisi dan telemetri lengkap tampil di bawah
          setelah Anda memilih shipment.
        </p>
      </div>

      <MapLibreMap
        shipments={shipmentData}
        selectedBox={selectedBox}
        onBoxSelect={setSelectedBox}
      />

      {selected ? (
        <div
          className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          role="region"
          aria-label="Detail shipment terpilih">
          <div
            className={cn(
              "h-1 bg-gradient-to-r",
              statusStyles[selected.status].bar,
            )}
          />
          <div className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                    selected.status === "healthy"
                      ? "bg-primary/15"
                      : selected.status === "warning"
                        ? "bg-warning/15"
                        : "bg-destructive/15",
                  )}>
                  <Package
                    className={cn(
                      "h-5 w-5",
                      selected.status === "healthy"
                        ? "text-primary"
                        : selected.status === "warning"
                          ? "text-warning"
                          : "text-destructive",
                    )}
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">
                    {selected.boxId}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        statusStyles[selected.status].badge,
                      )}>
                      {selected.status}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {selected.location}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBox(null)}
                className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Tutup detail">
                <X className="h-4 w-4" />
              </button>
            </div>

            {coords && (
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 rounded-lg border border-border/80 bg-muted/30 px-3 py-2.5 font-mono text-xs text-foreground">
                <span>
                  <span className="text-muted-foreground">Lat </span>
                  {coords.lat.toFixed(5)}°
                </span>
                <span>
                  <span className="text-muted-foreground">Lng </span>
                  {coords.lng.toFixed(5)}°
                </span>
              </div>
            )}

            <div className="mt-4 rounded-lg border border-border/80 bg-secondary/30 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Ringkasan kondisi
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {selected.conditionReport}
              </p>
            </div>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Telemetri
            </p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              <li className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  G-Force puncak
                </span>
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    selected.gForcePeak > 5
                      ? "text-destructive"
                      : "text-foreground",
                  )}>
                  {selected.gForcePeak.toFixed(1)}g
                </span>
              </li>
              <li className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Cpu className="h-4 w-4" />
                  AI risiko
                </span>
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    selected.aiDamageLikelihood > 50
                      ? "text-destructive"
                      : "text-foreground",
                  )}>
                  {selected.aiDamageLikelihood}%
                </span>
              </li>
              <li className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Battery className="h-4 w-4" />
                  Baterai
                </span>
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    selected.battery < 50
                      ? "text-destructive"
                      : "text-foreground",
                  )}>
                  {selected.battery}%
                </span>
              </li>
              <li className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Signal className="h-4 w-4" />
                  Sinyal
                </span>
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    selected.signalStrength < 50
                      ? "text-destructive"
                      : "text-foreground",
                  )}>
                  {selected.signalStrength}%
                </span>
              </li>
            </ul>

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-3 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                Update terakhir
              </span>
              <span className="text-right text-xs font-medium text-foreground">
                {formatTelemetryTime(selected.timestamp)}
              </span>
            </div>

            <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/20 px-3 py-2.5">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Shield className="h-3.5 w-3.5" />
                Integrity hash
              </p>
              <p className="mt-1.5 break-all font-mono text-[11px] leading-snug text-muted-foreground">
                {shortHash(selected.storageHash)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Pilih <strong className="text-foreground">titik di peta</strong>{" "}
            (popup koordinat) atau{" "}
            <strong className="text-foreground">kartu shipment</strong> di
            bawah untuk menampilkan ringkasan kondisi dan detail di sini.
          </p>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Daftar shipment
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {shipmentData.map((s) => (
            <div
              key={s.id}
              role="button"
              tabIndex={0}
              onClick={() =>
                setSelectedBox(selectedBox === s.boxId ? null : s.boxId)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedBox(selectedBox === s.boxId ? null : s.boxId);
                }
              }}
              className={cn(
                "cursor-pointer rounded-xl border bg-card p-5 transition-all",
                selectedBox === s.boxId
                  ? "border-primary/50 bg-secondary/20 shadow-md"
                  : "border-border hover:border-primary/20",
              )}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      s.status === "healthy"
                        ? "bg-primary/15"
                        : s.status === "warning"
                          ? "bg-warning/15"
                          : "bg-destructive/15",
                    )}>
                    <Package
                      className={cn(
                        "h-5 w-5",
                        s.status === "healthy"
                          ? "text-primary"
                          : s.status === "warning"
                            ? "text-warning"
                            : "text-destructive",
                      )}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{s.boxId}</p>
                    <div className="mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {s.location}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-1 text-xs font-medium capitalize",
                    s.status === "healthy"
                      ? "bg-primary/15 text-primary"
                      : s.status === "warning"
                        ? "bg-warning/15 text-warning"
                        : "bg-destructive/15 text-destructive",
                  )}>
                  {s.status}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">G-Force</p>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      s.gForcePeak > 5
                        ? "text-destructive"
                        : "text-foreground",
                    )}>
                    {s.gForcePeak.toFixed(1)}g
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Battery className="mb-0.5 h-3 w-3 text-muted-foreground" />
                  <p className="text-sm font-semibold text-foreground">
                    {s.battery}%
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Signal className="mb-0.5 h-3 w-3 text-muted-foreground" />
                  <p className="text-sm font-semibold text-foreground">
                    {s.signalStrength}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
