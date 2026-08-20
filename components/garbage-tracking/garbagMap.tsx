"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import type { Vehicle } from "./GarbageTracking";

interface GarbageMapProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle) => void;
  setSheetExpanded: (value: boolean) => void;
  userLocation: [number, number] | null;
  showRoutes: boolean;
}

const iconTracker = L.divIcon({
  className: "bg-transparent border-none",
  html: `
    <div class="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/20">
      <div class="h-3 w-3 rounded-full border-2 border-white bg-blue-600 shadow"></div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function createVehicleIcon(vehicle: Vehicle) {
  const active = vehicle.status === "EN_RUTA";

  return L.divIcon({
    className: "border-none bg-transparent",
    html: `
      <div class="relative flex h-14 w-14 items-center justify-center">

        ${
          active
            ? `
              <div class="absolute h-14 w-14 animate-ping rounded-full border border-emerald-400 opacity-40"></div>
            `
            : ""
        }

        <div
          class="relative flex h-11 w-11 items-center justify-center rounded-full border-2 ${
            active ? "border-emerald-500" : "border-slate-300"
          } bg-white text-xl shadow-lg"
        >
          🚛
        </div>

      </div>
    `,
    iconSize: [56, 56],
    iconAnchor: [28, 28],
  });
}

function UserLocation({ location }: { location: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (!location) return;

    map.flyTo(location, 15, {
      duration: 1,
    });
  }, [location, map]);

  return null;
}

export default function GarbageMap({
  vehicles,
  selectedVehicle,
  setSelectedVehicle,
  setSheetExpanded,
  userLocation,
  showRoutes,
}: GarbageMapProps) {
  return (
    <MapContainer
      center={[-12.593, -69.189]}
      zoom={14}
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <UserLocation location={userLocation} />

      {/* RUTAS Y VEHÍCULOS */}
      {vehicles.map((vehicle) => (
        <div key={vehicle.id}>
          {showRoutes && (
            <Polyline
              positions={vehicle.routePath}
              pathOptions={{
                color: vehicle.status === "EN_RUTA" ? vehicle.color : "gray",
                weight: 5,
              }}
            />
          )}

          <Marker
            position={vehicle.position}
            icon={createVehicleIcon(vehicle)}
            eventHandlers={{
              click: () => {
                setSelectedVehicle(vehicle);
                setSheetExpanded(true);
              },
            }}
          />
        </div>
      ))}

      {/* UBICACIÓN DEL USUARIO */}
      {userLocation && (
        <>
          <Circle
            center={userLocation}
            radius={35}
            pathOptions={{
              color: "#2563eb",
              fillColor: "#3b82f6",
              fillOpacity: 0.2,
            }}
          />

          <Marker position={userLocation} icon={iconTracker} />
        </>
      )}
    </MapContainer>
  );
}
