"use client";
import { LocateFixed } from "lucide-react";
import { useEffect, useState } from "react";
import DescriptionGarbage from "./DescriptionGarbage";
type VehicleStatus = "EN_RUTA" | "DETENIDO" | "FUERA_DE_SERVICIO";
import dynamic from "next/dynamic";
import { useSocket } from "@/app/providers/SockerProvider";

export interface Vehicle {
  id: string;
  routeId: string;

  code: string;
  plate: string;
  driver: string;
  route: string;

  status: VehicleStatus;

  speed: number;
  position: [number, number];

  routePath: {
    lat: number;
    lng: number;
  }[];

  updatedAt: number;

  color: string;

  heading?: number;
  accuracy?: number | null;
  appState?: string | null;

  activeRouteId: string | null;
}


const GarbageMap = dynamic(() => import("./garbagMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-100">
      <div className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow">
        Cargando mapa...
      </div>
    </div>
  ),
});

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function GarbageTracking() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleVehiclePosition = (data: Vehicle) => {
      console.log("📍 Posición recibida:", data);

      setVehicles((currentVehicles) =>
        currentVehicles.map((vehicle) => {
          if (vehicle.routeId === data.activeRouteId) {
            return {
              ...vehicle,
              ...data,
            };
          }

          if (vehicle.id === data.id) {
            return {
              ...vehicle,
              status: "DETENIDO",
              activeRouteId: data.activeRouteId,
              position: vehicle.position,
            };
          }

          return vehicle;
        }),
      );

      setSelectedVehicle((currentSelected) => {
        if (!currentSelected || currentSelected.id !== data.id) {
          return currentSelected;
        }

        return {
          ...currentSelected,
          ...data,
        };
      });
    };

    socket.on("vehicle:position", handleVehiclePosition);

    return () => {
      socket.off("vehicle:position", handleVehiclePosition);
    };
  }, [socket]);

  const [sheetExpanded, setSheetExpanded] = useState(false);

  const distance =
    userLocation && selectedVehicle
      ? calculateDistance(
        userLocation[0],
        userLocation[1],
        selectedVehicle.position[0],
        selectedVehicle.position[1],
      )
      : null;

  const locateUser = () => {
    if (!navigator.geolocation) {
      alert("La ubicación no está disponible en este dispositivo.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert(
              "La ubicación está desactivada o el permiso fue rechazado.",
            );
            break;

          case error.POSITION_UNAVAILABLE:
            alert(
              "No se pudo obtener tu ubicación.",
            );
            break;

          case error.TIMEOUT:
            alert(
              "No se pudo obtener tu ubicación a tiempo.",
            );
            break;

          default:
            alert(
              "No fue posible obtener tu ubicación.",
            );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const activeVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "EN_RUTA"
  );

  const activeVehicleCount = new Set(
    activeVehicles.map((vehicle) => vehicle.id)
  ).size;

  useEffect(() => {
    async function loadVehicles() {
      try {
        const response = await fetch("/api/vehicles/map");
        if (!response.ok) {
          throw new Error("No se pudieron cargar los vehículos.");
        }

        const data: Vehicle[] = await response.json();
        setVehicles(data);

      } catch (error) {
        console.error("Error cargando vehículos:", error);
      }
    }

    loadVehicles();
  }, []);


  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      <GarbageMap
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
        setSelectedVehicle={setSelectedVehicle}
        setSheetExpanded={setSheetExpanded}
        userLocation={userLocation}
      />

      <div className="absolute left-3 top-[12px] z-[500]">
        <div className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

          <span className="text-[11px] font-bold text-slate-700">
            {activeVehicleCount} vehículos en ruta
          </span>
        </div>
      </div>

      <div className="absolute bottom-[280px] duration-200 hover:scale-105 right-4 z-[9000] flex flex-col gap-2 group">
        <button
          onClick={locateUser}
          className={`flex h-12 w-12 items-center justify-center rounded-full text-slate-700 shadow-xl transition active:scale-95 ${userLocation ? "bg-emerald-500 text-white" : "bg-white"}`}
        >
          <LocateFixed className="group-hover:rotate-6 duration-200" size={20} />
        </button>
      </div>

      <DescriptionGarbage
        selectedVehicle={selectedVehicle}
        setSelectedVehicle={setSelectedVehicle}
        setSheetExpanded={setSheetExpanded}
        sheetExpanded={sheetExpanded}
        distance={distance}
        locateUser={locateUser}
      />
    </div>
  );
}
