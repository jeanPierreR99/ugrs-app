"use client";

import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Polyline,
  Tooltip,
  Marker,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import { deleteRoute } from "@/app/admin/rutas/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React from "react";

interface RoutePoint {
  lat: number;
  lng: number;
}

interface ExistingRoute {
  id: string;
  name: string;
  description: string | null;
  color: string;
  active: boolean;
  routePath: RoutePoint[];
}

interface Props {
  initialPoints?: RoutePoint[];
  existingRoutes?: ExistingRoute[];
  onChange?: (points: RoutePoint[]) => void;
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

export default function RouteMapEditor({
  initialPoints = [],
  existingRoutes = [],
  onChange,
}: Props) {
  const [points, setPoints] = useState<RoutePoint[]>(initialPoints);
  const featureGroupRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    onChange?.(points);
  }, [points, onChange]);

  const handleCreated = (e: any) => {
    const layer = e.layer;

    if (e.layerType !== "polyline") {
      return;
    }

    const latlngs = layer.getLatLngs();

    const newPoints: RoutePoint[] = latlngs.map((point: any) => ({
      lat: Number(point.lat.toFixed(6)),
      lng: Number(point.lng.toFixed(6)),
    }));

    setPoints(newPoints);

    console.log("CROQUIS:", newPoints);
  };

  const onDeleteRoute = async (id: string) => {
    const result = await deleteRoute(id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Ruta eliminada exitosamente");

    router.refresh();
  };

  const handleEdited = (e: any) => {
    e.layers.eachLayer((layer: any) => {
      if (layer instanceof L.Polyline) {
        const latlngs = layer.getLatLngs();

        const updatedPoints: RoutePoint[] = latlngs.map((point: any) => ({
          lat: Number(point.lat.toFixed(6)),
          lng: Number(point.lng.toFixed(6)),
        }));

        setPoints(updatedPoints);
      }
    });
  };

  const handleDeleted = () => {
    setPoints([]);
  };

  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
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

        {existingRoutes.map((route) => {
          const positions = route.routePath.map(
            (point) => [point.lat, point.lng] as [number, number],
          );

          if (positions.length < 2) {
            return null;
          }

          const startPosition = positions[0];
          const endPosition = positions[positions.length - 1];

          return (
            <React.Fragment key={route.id}>
              <Polyline
                positions={positions}
                eventHandlers={{
                  click: () => {
                    const confirmed = window.confirm(
                      `¿Desea eliminar la ruta "${route.name}"?\n\nEsta acción eliminará la ruta del vehículo que la contiene.`,
                    );

                    if (confirmed) {
                      onDeleteRoute(route.id);
                    }
                  },
                }}
                pathOptions={{
                  color: route.color,
                  weight: 5,
                  opacity: route.active ? 0.8 : 0.35,
                }}
              >
                <Tooltip permanent sticky direction="top">
                  <strong>{route.name}</strong>
                </Tooltip>
              </Polyline>

              <Marker position={startPosition} icon={startIcon}></Marker>

              <Marker position={endPosition} icon={endIcon}></Marker>
            </React.Fragment>
          );
        })}

        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            onEdited={handleEdited}
            onDeleted={handleDeleted}
            draw={{
              polyline: {
                shapeOptions: {
                  color: "red",
                  weight: 5,
                },
              },
              polygon: false,
              rectangle: false,
              circle: false,
              circlemarker: false,
              marker: false,
            }}
            edit={{
              remove: true,
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
}
