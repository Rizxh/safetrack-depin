"use client";

import { useEffect, useRef, useState } from "react";
import {
  Package,
  AlertCircle,
  Loader2,
  X,
  MapPin,
  Activity,
  Cpu,
  Battery,
  Signal,
  Clock,
  Shield,
} from "lucide-react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { ShipmentRecord } from "@/data/mockData";
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

const statusUi = {
  healthy: {
    label: "Healthy",
    dot: "bg-emerald-500",
    bar: "from-emerald-500 to-teal-600",
    badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
  },
  warning: {
    label: "Warning",
    dot: "bg-amber-500",
    bar: "from-amber-500 to-orange-600",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25",
  },
  critical: {
    label: "Critical",
    dot: "bg-red-500",
    bar: "from-red-500 to-rose-700",
    badge: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/25",
  },
} as const;

interface MapLibreMapProps {
  shipments: ShipmentRecord[];
  selectedBox: string | null;
  onBoxSelect: (boxId: string | null) => void;
}

// Coordinates for all shipments (from mockData)
const shipmentCoordinates: Record<string, [number, number]> = {
  "BOX-7A12": [9.9937, 53.5511], // Hamburg, DE
  "BOX-3K49": [4.3175, 52.0807], // Rotterdam, NL
  "BOX-9M22": [4.4017, 51.2214], // Antwerp, BE
  "BOX-1P87": [121.4737, 31.2304], // Shanghai, CN
  "BOX-5T63": [103.8198, 1.3521], // Singapore, SG
  "BOX-8R41": [55.2708, 25.2048], // Dubai, AE
  "BOX-2V98": [139.6917, 35.6895], // Tokyo, JP
  "BOX-6W15": [3.3792, 6.5244], // Lagos, NG
  "BOX-4X77": [-74.0060, 40.7128], // New York, US
  "BOX-0Y34": [-46.6539, -23.4647], // São Paulo, BR
};

// Get icon SVG based on status
const getStatusIcon = (status: string): string => {
  switch (status) {
    case "healthy":
      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      `;
    case "warning":
      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <line x1="12" x2="12" y1="9" y2="13"/>
          <line x1="12" x2="12.01" y1="17" y2="17"/>
        </svg>
      `;
    case "critical":
      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" x2="9" y1="9" y2="15"/>
          <line x1="9" x2="15" y1="9" y2="15"/>
        </svg>
      `;
    default:
      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" x2="12" y1="8" y2="12"/>
          <line x1="12" x2="12.01" y1="16" y2="16"/>
        </svg>
      `;
  }
};

export function MapLibreMap({ shipments, selectedBox, onBoxSelect }: MapLibreMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const timer = setTimeout(() => {
      if (!mapContainer.current) return;

      try {
        setIsLoading(true);

        // Initialize the map with OpenFreeMap bright style (GLOBAL VIEW)
        const map = new maplibregl.Map({
          container: mapContainer.current,
          style: 'https://tiles.openfreemap.org/styles/bright',
          center: [0, 20], // Center of the world (Atlantic, near equator)
          zoom: 1.5, // Zoom level to show entire world
        });

        map.on('load', () => {
          setIsLoading(false);
          setTimeout(() => map.resize(), 100);
        });

        map.on('error', (e: any) => {
          setError('Failed to load map tiles');
          setIsLoading(false);
        });

        mapRef.current = map;

        // Add navigation control
        map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'top-right');

      } catch (err) {
        setError('Failed to initialize map: ' + (err as Error).message);
        setIsLoading(false);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || isLoading || !selectedBox) return;
    const coords = shipmentCoordinates[selectedBox];
    if (!coords) return;
    const z = Math.max(map.getZoom(), 4);
    map.flyTo({
      center: coords,
      zoom: z,
      duration: 900,
      essential: true,
    });
  }, [selectedBox, isLoading]);

  // Update markers when shipments or selection changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || isLoading) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each shipment
    shipments.forEach((shipment) => {
      const coords = shipmentCoordinates[shipment.boxId];
      if (!coords) return;

      const statusColors = {
        healthy: '#14b8a6',
        warning: '#f59e0b',
        critical: '#ef4444',
      };

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'shipment-marker';

      el.style.cssText = `
        width: 36px;
        height: 36px;
        background: ${statusColors[shipment.status]};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.45);
        cursor: pointer;
        transition: box-shadow 0.2s ease, border-color 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        transform: translateZ(0);
        backface-visibility: hidden;
      `;

      if (selectedBox === shipment.boxId) {
        el.style.boxShadow = `0 0 0 3px #fff, 0 0 22px ${statusColors[shipment.status]}aa, 0 6px 18px rgba(0,0,0,0.45)`;
        el.style.zIndex = "100";
        el.style.borderColor = "#fff";
      }

      el.innerHTML = getStatusIcon(shipment.status);
      const svg = el.querySelector("svg");
      if (svg) {
        svg.style.display = "block";
        svg.style.flexShrink = "0";
      }

      el.addEventListener("mouseenter", () => {
        if (selectedBox !== shipment.boxId) {
          el.style.boxShadow = `0 0 0 2px rgba(255,255,255,0.95), 0 4px 14px ${statusColors[shipment.status]}70, 0 2px 8px rgba(0,0,0,0.4)`;
        }
      });

      el.addEventListener("mouseleave", () => {
        if (selectedBox !== shipment.boxId) {
          el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.45)";
        }
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(coords)
        .addTo(map);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const isSame = selectedBox === shipment.boxId;
        if (isSame) {
          onBoxSelect(null);
          return;
        }
        onBoxSelect(shipment.boxId);
      });

      markersRef.current.push(marker);
    });

  }, [shipments, selectedBox, onBoxSelect, isLoading]);

  const selectedShipment =
    selectedBox != null
      ? (shipments.find((s) => s.boxId === selectedBox) ?? null)
      : null;

  if (error) {
    return (
      <div className="relative w-full h-[400px] rounded-xl border border-border overflow-hidden bg-muted flex items-center justify-center">
        <div className="text-center p-6">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-xs text-muted-foreground mt-2">Please check browser console for details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-xl border border-border overflow-hidden bg-card">
      <div
        ref={mapContainer}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      />

      {selectedShipment && (
        <div
          className="absolute left-3 top-3 z-20 w-[min(calc(100%-1.5rem),20rem)] max-h-[min(22rem,calc(100%-5rem))] overflow-y-auto rounded-xl border border-border bg-card/95 shadow-lg backdrop-blur-md"
          role="dialog"
          aria-label="Package condition preview">
          <div
            className={cn(
              "h-1 rounded-t-[inherit] bg-gradient-to-r",
              statusUi[selectedShipment.status].bar,
            )}
          />
          <div className="p-3.5 pt-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={cn(
                    "h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-background",
                    statusUi[selectedShipment.status].dot,
                  )}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {selectedShipment.boxId}
                  </p>
                  <span
                    className={cn(
                      "mt-0.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      statusUi[selectedShipment.status].badge,
                    )}>
                    {statusUi[selectedShipment.status].label}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onBoxSelect(null)}
                className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Close preview">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{selectedShipment.location}</span>
            </p>

            <div className="mt-3 rounded-lg border border-border/80 bg-secondary/40 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Kondisi paket
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground">
                {selectedShipment.conditionReport}
              </p>
            </div>

            <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Detail telemetri
            </p>
            <ul className="mt-2 space-y-2 text-xs">
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Activity className="h-3.5 w-3.5" />
                  G-Force puncak
                </span>
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    selectedShipment.gForcePeak > 5
                      ? "text-destructive"
                      : "text-foreground",
                  )}>
                  {selectedShipment.gForcePeak.toFixed(1)}g
                </span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Cpu className="h-3.5 w-3.5" />
                  AI risiko kerusakan
                </span>
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    selectedShipment.aiDamageLikelihood > 50
                      ? "text-destructive"
                      : "text-foreground",
                  )}>
                  {selectedShipment.aiDamageLikelihood}%
                </span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Battery className="h-3.5 w-3.5" />
                  Baterai
                </span>
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    selectedShipment.battery < 50
                      ? "text-destructive"
                      : "text-foreground",
                  )}>
                  {selectedShipment.battery}%
                </span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Signal className="h-3.5 w-3.5" />
                  Sinyal
                </span>
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    selectedShipment.signalStrength < 50
                      ? "text-destructive"
                      : "text-foreground",
                  )}>
                  {selectedShipment.signalStrength}%
                </span>
              </li>
              <li className="flex items-start justify-between gap-2 border-t border-border/60 pt-2">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  Update terakhir
                </span>
                <span className="text-right text-[11px] font-medium text-foreground">
                  {formatTelemetryTime(selectedShipment.timestamp)}
                </span>
              </li>
            </ul>

            <div className="mt-3 rounded-md border border-dashed border-border bg-muted/30 px-2.5 py-2">
              <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Shield className="h-3 w-3" />
                Integrity hash
              </p>
              <p className="mt-1 break-all font-mono text-[10px] leading-snug text-muted-foreground">
                {shortHash(selectedShipment.storageHash)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}

      {/* Info Badge */}
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur border border-border px-3 py-2 rounded-lg flex items-center gap-2 z-10">
        <Package className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          Live Tracking Map
        </span>
      </div>
    </div>
  );
}
