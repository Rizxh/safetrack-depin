"use client";

import { useEffect, useRef, useState } from "react";
import { Package, AlertCircle, Loader2 } from "lucide-react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { ShipmentRecord } from "@/data/mockData";
import { shipmentCoordinates } from "@/data/shipmentCoordinates";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface MapLibreMapProps {
  shipments: ShipmentRecord[];
  selectedBox: string | null;
  onBoxSelect: (boxId: string | null) => void;
}

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

        const map = new maplibregl.Map({
          container: mapContainer.current,
          style: "https://tiles.openfreemap.org/styles/bright",
          center: [0, 20],
          zoom: 1.5,
        });

        map.on("load", () => {
          setIsLoading(false);
          setTimeout(() => map.resize(), 100);
        });

        map.on("error", () => {
          setError("Failed to load map tiles");
          setIsLoading(false);
        });

        mapRef.current = map;

        map.addControl(
          new maplibregl.NavigationControl({ showCompass: true, showZoom: true }),
          "top-right",
        );
      } catch (err) {
        setError("Failed to initialize map: " + (err as Error).message);
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

  useEffect(() => {
    const map = mapRef.current;
    if (!map || isLoading) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    shipments.forEach((shipment) => {
      const coords = shipmentCoordinates[shipment.boxId];
      if (!coords) return;

      const statusColors = {
        healthy: "#14b8a6",
        warning: "#f59e0b",
        critical: "#ef4444",
      };

      const [lng, lat] = coords;

      const el = document.createElement("div");
      el.className = "shipment-marker";

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

      const popup = new maplibregl.Popup({
        offset: 20,
        closeButton: true,
        closeOnClick: true,
        maxWidth: "200px",
      }).setHTML(`
        <div style="font-family:system-ui,-apple-system,sans-serif;padding:2px 2px 4px;min-width:132px">
          <div style="font-weight:600;font-size:13px;margin-bottom:8px;color:#fafafa">${escapeHtml(shipment.boxId)}</div>
          <div style="font-size:11px;line-height:1.55;color:#d4d4d8">
            <div style="display:flex;justify-content:space-between;gap:8px"><span style="color:#a1a1aa">Latitude</span><span style="font-variant-numeric:tabular-nums">${lat.toFixed(5)}°</span></div>
            <div style="display:flex;justify-content:space-between;gap:8px;margin-top:4px"><span style="color:#a1a1aa">Longitude</span><span style="font-variant-numeric:tabular-nums">${lng.toFixed(5)}°</span></div>
          </div>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(coords)
        .setPopup(popup)
        .addTo(map);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const isSame = selectedBox === shipment.boxId;
        if (isSame) {
          onBoxSelect(null);
          if (marker.getPopup().isOpen()) marker.togglePopup();
          return;
        }
        onBoxSelect(shipment.boxId);
        markersRef.current.forEach((m) => {
          if (m.getPopup().isOpen()) m.togglePopup();
        });
        if (!marker.getPopup().isOpen()) marker.togglePopup();
      });

      markersRef.current.push(marker);
    });
  }, [shipments, selectedBox, onBoxSelect, isLoading]);

  if (error) {
    return (
      <div className="relative flex h-[400px] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
        <div className="p-6 text-center">
          <AlertCircle className="mx-auto mb-3 h-12 w-12 text-destructive" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Please check browser console for details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-xl border border-border bg-card">
      <div
        ref={mapContainer}
        className="absolute inset-0 h-full w-full"
        style={{ width: "100%", height: "100%", position: "absolute" }}
      />

      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-lg border border-border bg-background/80 px-3 py-2 backdrop-blur">
        <Package className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Klik titik untuk koordinat</span>
      </div>
    </div>
  );
}
