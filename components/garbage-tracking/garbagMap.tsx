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
  const color = vehicle.color || "#448d20";

  return L.divIcon({
    className: "border-none bg-transparent",

    html: `
      <div
        class="relative flex h-14 w-14 items-center justify-center"
      >
        ${
          active
            ? `
              <div
                class="absolute h-14 w-14 animate-ping rounded-full border opacity-40"
                style="border-color: ${color};"
              ></div>
            `
            : ""
        }

        <div
          class="relative flex h-11 w-11 items-center justify-center rounded-full border-2 bg-white text-xl shadow-lg"
          style="
            border-color: ${active ? color : "#cbd5e1"};
          "
        >
          🚛
        </div>
      </div>
    `,

    iconSize: [56, 56],
    iconAnchor: [28, 28],
  });
}

const startIcon = L.divIcon({
  className: "border-none bg-transparent",
  html: `
    <div class="flex flex-col items-center">
      <div
        class="mt-1 rounded-md bg-emerald-600
               px-2 py-0.5 text-[10px] font-bold
               text-white shadow-md"
      >
        INICIO
      </div>
    </div>
  `,
  iconSize: [70, 55],
  iconAnchor: [35, 16],
});

const endIcon = L.divIcon({
  className: "border-none bg-transparent",
  html: `
    <div class="flex flex-col items-center">
      <div
        class="mt-1 rounded-md bg-red-600
               px-2 py-0.5 text-[10px] font-bold
               text-white shadow-md"
      >
        FIN
      </div>
    </div>
  `,
  iconSize: [70, 55],
  iconAnchor: [35, 16],
});

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

function distanceBetweenPoints(a: [number, number], b: [number, number]) {
  const R = 6371000;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function getRouteProgress(vehicle: Vehicle) {
  const position: [number, number] = vehicle.position;

  let closestIndex = 0;
  let closestDistance = Infinity;

  vehicle.routePath.forEach((point: any, index: any) => {
    const distance = distanceBetweenPoints(position, [point.lat, point.lng]);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
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
        attribution="&copy; Google Maps"
        url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
      />

      <UserLocation location={userLocation} />

      {vehicles.map((vehicle) => (
        <div key={vehicle.id}>
          {showRoutes &&
            (() => {
              const currentIndex = getRouteProgress(vehicle);

              const completedRoute = vehicle.routePath
                .slice(0, currentIndex + 1)
                .map(
                  (point: any) => [point.lat, point.lng] as [number, number],
                );

              const remainingRoute = vehicle.routePath
                .slice(currentIndex)
                .map(
                  (point: any) => [point.lat, point.lng] as [number, number],
                );

              return (
                <>
                  <Polyline
                    positions={completedRoute}
                    pathOptions={{
                      color: vehicle.color,
                      weight: 7,
                      opacity: 1,
                    }}
                  />

                  <Polyline
                    positions={remainingRoute}
                    pathOptions={{
                      color: vehicle.color,
                      weight: 5,
                      opacity: 0.6,
                      dashArray: "8 16",
                    }}
                  />
                </>
              );
            })()}

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

          {vehicle.routePath?.length >= 2 && (
            <>
              <Marker
                position={[vehicle.routePath[0].lat, vehicle.routePath[0].lng]}
                icon={startIcon}
              />

              <Marker
                position={[
                  vehicle.routePath[vehicle.routePath.length - 1].lat,
                  vehicle.routePath[vehicle.routePath.length - 1].lng,
                ]}
                icon={endIcon}
              />
            </>
          )}
        </div>
      ))}

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
