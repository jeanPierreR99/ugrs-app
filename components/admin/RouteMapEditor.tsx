"use client";

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";

interface RoutePoint {
  lat: number;
  lng: number;
}

interface Props {
  initialPoints?: RoutePoint[];
  onChange?: (points: RoutePoint[]) => void;
}

const startIcon = L.divIcon({
  className: "bg-transparent border-none",
  html: `
    <div class="flex h-8 w-8 items-center justify-center
                rounded-full border-2 border-white
                bg-emerald-500 text-white shadow-lg">
      A
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const endIcon = L.divIcon({
  className: "bg-transparent border-none",
  html: `
    <div class="flex h-8 w-8 items-center justify-center
                rounded-full border-2 border-white
                bg-red-500 text-white shadow-lg">
      B
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function MapClickHandler({ onAdd }: { onAdd: (point: RoutePoint) => void }) {
  useMapEvents({
    click(e) {
      onAdd({
        lat: Number(e.latlng.lat.toFixed(6)),
        lng: Number(e.latlng.lng.toFixed(6)),
      });
    },
  });

  return null;
}

export default function RouteMapEditor({
  initialPoints = [],
  onChange,
}: Props) {
  const [points, setPoints] = useState<RoutePoint[]>(initialPoints);

  useEffect(() => {
    onChange?.(points);
  }, [points, onChange]);

  const addPoint = (point: RoutePoint) => {
    setPoints((current) => [...current, point]);
  };


  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* MAPA */}
      <div className="h-full">
        <MapContainer
          center={[-12.593, -69.189]}
          zoom={15}
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; Google Maps"
            url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
          />

          <MapClickHandler onAdd={addPoint} />

          {points.length > 0 && (
            <Polyline
              positions={points.map((point) => [point.lat, point.lng])}
              pathOptions={{
                color: "#059669",
                weight: 6,
                opacity: 0.9,
              }}
            />
          )}

          {points.length >= 1 && (
            <Marker
              position={[points[0].lat, points[0].lng]}
              icon={startIcon}
            />
          )}

          {points.length >= 2 && (
            <Marker
              position={[
                points[points.length - 1].lat,
                points[points.length - 1].lng,
              ]}
              icon={endIcon}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
