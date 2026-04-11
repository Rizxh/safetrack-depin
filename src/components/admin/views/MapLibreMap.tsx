"use client";

import { useEffect, useRef, useState } from "react";
import { Package, AlertCircle, Loader2 } from "lucide-react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface ShipmentData {
  id: string;
  boxId: string;
  location: string;
  status: "healthy" | "warning" | "critical";
  gForcePeak: number;
  battery: number;
  signalStrength: number;
}

interface MapLibreMapProps {
  shipments: ShipmentData[];
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

  // Update markers when shipments or selection changes
  useEffect(() => {
    if (!mapRef.current || isLoading) return;

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
        box-shadow: 0 2px 8px rgba(0,0,0,0.5);
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
      `;

      if (selectedBox === shipment.boxId) {
        el.style.transform = 'scale(1.3)';
        el.style.boxShadow = `0 0 20px ${statusColors[shipment.status]}80, 0 4px 16px rgba(0,0,0,0.6)`;
        el.style.zIndex = '100';
        el.style.borderColor = '#fff';
      }

      // Set icon based on status
      el.innerHTML = getStatusIcon(shipment.status);

      el.addEventListener('mouseenter', () => {
        if (selectedBox !== shipment.boxId) {
          el.style.transform = 'scale(1.15)';
          el.style.boxShadow = `0 0 15px ${statusColors[shipment.status]}60`;
        }
      });

      el.addEventListener('mouseleave', () => {
        if (selectedBox !== shipment.boxId) {
          el.style.transform = 'scale(1)';
          el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.5)';
        }
      });

      // Create popup with complete shipment data
      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
      }).setHTML(`
        <div style="
          font-family: system-ui, -apple-system, sans-serif;
          padding: 12px 14px;
          min-width: 200px;
          background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
          color: #fff;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
        ">
          <div style="font-weight: bold; font-size: 15px; margin-bottom: 6px; color: #fff; display: flex; align-items: center; gap: 6px;">
            <span style="color: ${statusColors[shipment.status]}">●</span>
            ${shipment.boxId}
          </div>
          <div style="font-size: 12px; color: #a0a0a0; margin-bottom: 10px; display: flex; align-items: center; gap: 4px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${shipment.location}
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; font-size: 11px;">
            <div style="color: #a0a0a0;">G-Force:</div>
            <div style="font-weight: 600; color: ${shipment.gForcePeak > 5 ? '#ef4444' : '#fff'};">
              ${shipment.gForcePeak.toFixed(1)}g
            </div>
            <div style="color: #a0a0a0;">Battery:</div>
            <div style="font-weight: 500; color: ${shipment.battery < 50 ? '#ef4444' : '#fff'};">
              ${shipment.battery}%
            </div>
            <div style="color: #a0a0a0;">Signal:</div>
            <div style="font-weight: 500; color: ${shipment.signalStrength < 50 ? '#ef4444' : '#fff'};">
              ${shipment.signalStrength}%
            </div>
          </div>
          <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
            <span style="
              display: inline-block;
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              background: ${statusColors[shipment.status]}20;
              color: ${statusColors[shipment.status]};
            ">
              ${shipment.status}
            </span>
          </div>
        </div>
      `);

      // Add marker to map
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(coords)
        .setPopup(popup)
        .addTo(mapRef.current);

      // Handle marker click - show popup and select
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onBoxSelect(selectedBox === shipment.boxId ? null : shipment.boxId);
        // Toggle popup
        if (marker.getPopup().isOpen()) {
          marker.togglePopup();
        } else {
          marker.togglePopup();
        }
      });

      markersRef.current.push(marker);
    });

  }, [shipments, selectedBox, onBoxSelect, isLoading]);

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
