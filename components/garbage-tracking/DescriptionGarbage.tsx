"use client";

import React from "react";
import {
  Clock3,
  Gauge,
  LocateFixed,
  MapPinned,
  Navigation,
  Radio,
  Route,
  Truck,
} from "lucide-react";
import { Vehicle } from "./GarbageTracking";
import { calculateRouteProgress } from "@/utils/routeUtils";

interface Props {
  selectedVehicle: Vehicle | null;
  setSheetExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  sheetExpanded: boolean;
  distance: number | null;
  locateUser: () => void;
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const InfoCard = ({ icon, label, value, color }: InfoCardProps) => {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className={`mb-2 ${color}`}>{icon}</div>
      <p className="text-[10px] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
};

const formatDistance = (distance: number) => {
  if (distance < 1000) return `${Math.round(distance)} m`;
  return `${(distance / 1000).toFixed(1)} km`;
};

const DescriptionGarbage: React.FC<Props> = ({
  selectedVehicle,
  setSheetExpanded,
  sheetExpanded,
  distance,
  locateUser,
}) => {
  const SHEET_HEIGHT = 520;
  const CLOSED_OFFSET = 385;

  const [translateY, setTranslateY] = React.useState(
    sheetExpanded ? 0 : CLOSED_OFFSET,
  );

  const startY = React.useRef(0);
  const startTranslateY = React.useRef(0);
  const isDragging = React.useRef(false);
  const hasMoved = React.useRef(false);

  React.useEffect(() => {
    if (!isDragging.current) {
      setTranslateY(sheetExpanded ? 0 : CLOSED_OFFSET);
    }
  }, [sheetExpanded]);

  React.useEffect(() => {
    setTranslateY(CLOSED_OFFSET);
    setSheetExpanded(false);
  }, [selectedVehicle?.code, setSheetExpanded]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    hasMoved.current = false;
    startY.current = e.clientY;
    startTranslateY.current = translateY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    const deltaY = e.clientY - startY.current;

    if (Math.abs(deltaY) > 5) {
      hasMoved.current = true;
    }

    let nextTranslate = startTranslateY.current + deltaY;

    if (nextTranslate < 0) {
      nextTranslate = nextTranslate * 0.25;
    }

    if (nextTranslate > CLOSED_OFFSET) {
      nextTranslate = CLOSED_OFFSET + (nextTranslate - CLOSED_OFFSET) * 0.25;
    }
    setTranslateY(nextTranslate);
  };

  const finishDrag = (e?: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    isDragging.current = false;

    if (!hasMoved.current) {
      const shouldOpen = translateY > CLOSED_OFFSET / 2;
      setTranslateY(shouldOpen ? 0 : CLOSED_OFFSET);
      setSheetExpanded(shouldOpen);

      return;
    }
    const shouldOpen = translateY < CLOSED_OFFSET / 2;
    setTranslateY(shouldOpen ? 0 : CLOSED_OFFSET);
    setSheetExpanded(shouldOpen);

    if (e) {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    finishDrag(e);
  };

  const handlePointerCancel = () => {
    if (!isDragging.current) return;

    isDragging.current = false;
    const shouldOpen = translateY < CLOSED_OFFSET / 2;
    setTranslateY(shouldOpen ? 0 : CLOSED_OFFSET);
    setSheetExpanded(shouldOpen);
  };

  if (!selectedVehicle) return null;

  const routeInfo = calculateRouteProgress(
    {
      lat: selectedVehicle.position[0],
      lng: selectedVehicle.position[1],
    },
    selectedVehicle.routePath,
  );
  const isActive = selectedVehicle.status === "EN_RUTA";
  const progress = 1 - translateY / CLOSED_OFFSET;
  const contentOpacity = Math.max(0, Math.min(1, (progress - 0.08) / 0.35));

  return (
    <div
      className="pointer-events-auto absolute z-[9999] bottom-0 left-6/12 transform translate-x-[-50%] mx-auto w-full max-w-xl overflow-hidden rounded-t-[28px] bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.12)]"
      style={{
        height: `${SHEET_HEIGHT}px`,
        transform: `translateY(${translateY}px)`,
        transition: isDragging.current
          ? "none"
          : "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="touch-none select-none cursor-pointer"
      >
        <div className="flex h-9 items-center justify-center">
          <div className="h-1.5 w-12 rounded-full bg-slate-200" />
        </div>

        <div className="flex items-center justify-between gap-3 px-4 pb-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${selectedVehicle.status != "EN_RUTA" ? "bg-red-50" : "bg-emerald-50"}`}
            >
              <Truck
                size={24}
                className={`${selectedVehicle.status != "EN_RUTA" ? "text-red-600" : "text-emerald-600"}`}
              />

              {isActive && (
                <span
                  className={`absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white ${selectedVehicle.status != "EN_RUTA" ? "bg-red-500" : "bg-emerald-500"}`}
                />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  {selectedVehicle.code}
                </h2>

                <span
                  className={`${selectedVehicle.status != "EN_RUTA" ? "text-red-700 bg-red-50" : "text-emerald-700 bg-emerald-50"} flex items-center gap-1 rounded-full  px-2 py-1 text-[9px] font-bold`}
                >
                  <span
                    className={`${selectedVehicle.status != "EN_RUTA" ? "bg-red-500" : "text-emerald-500"} h-1.5 w-1.5 rounded-full bg-emerald-500`}
                  />
                  {selectedVehicle.status}
                </span>
              </div>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                {selectedVehicle.route}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1.5 text-[9px] font-medium text-slate-500">
            <Radio
              size={11}
              className={`${selectedVehicle.status != "EN_RUTA" ? "text-red-500" : "text-emerald-500"}`}
            />
            {selectedVehicle.status}
          </div>
        </div>
        <div className="flex justify-center px-4 pb-3">
          <span className="text-[10px] font-medium text-slate-400">
            {translateY < CLOSED_OFFSET * 0.1
              ? "Desliza hacia abajo para reducir información"
              : "Desliza hacia arriba para ver más información"}
          </span>
        </div>
      </div>

      <div
        className="overflow-y-auto px-4 pb-8"
        style={{
          height: `${SHEET_HEIGHT - 95}px`,
          opacity: contentOpacity,
          transform: `translateY(${(1 - contentOpacity) * 20}px)`,
          transition: isDragging.current
            ? "none"
            : "opacity 180ms ease, transform 180ms ease",
          pointerEvents: contentOpacity > 0.7 ? "auto" : "none",
        }}
      >
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
            <Route size={18} className="text-blue-600" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[9px] text-slate-400">Ruta asignada</p>

            <p className="mt-1 truncate text-xs font-semibold text-slate-800">
              {selectedVehicle.route} neuva ruta
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold text-emerald-600">
              {Math.round(routeInfo.progress)}%
            </p>

            <p className="text-[9px] text-slate-400">recorrido</p>
          </div>
        </div>

        <div className="mt-3">
          <div className="mb-1 flex justify-between">
            <span className="text-[9px] text-slate-400">Progreso de ruta</span>

            <span className="text-[9px] font-semibold text-slate-600">
              {Math.round(routeInfo.progress)}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{
                width: `${routeInfo.progress}%`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-between text-[9px]">
            <span className="text-slate-400">
              Recorrido: {formatDistance(routeInfo.traveledDistance)}
            </span>

            <span className="font-semibold text-orange-500">
              Falta: {formatDistance(routeInfo.remainingDistance)}
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <InfoCard
            icon={<Gauge size={17} />}
            label="Velocidad"
            value={`${selectedVehicle.speed} km/h`}
            color="text-emerald-600"
          />

          <InfoCard
            icon={<Navigation size={17} />}
            label="Recorrido"
            value={`${Math.round(routeInfo.progress)}%`}
            color="text-blue-600"
          />

          <InfoCard
            icon={<Clock3 size={17} />}
            label="Actualizado"
            value={`${selectedVehicle.updatedAt}s`}
            color="text-orange-500"
          />
        </div>

        {distance !== null ? (
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-blue-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                <MapPinned size={18} className="text-blue-600" />
              </div>

              <div>
                <p className="text-[9px] text-blue-600">
                  Distancia desde tu ubicación
                </p>

                <p className="mt-0.5 text-base font-bold text-blue-950">
                  {formatDistance(distance)}
                </p>
              </div>
            </div>

            <Navigation size={20} className="text-blue-600" />
          </div>
        ) : (
          <button
            type="button"
            onClick={locateUser}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <LocateFixed size={18} />
            Activar mi ubicación
          </button>
        )}

        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[9px] text-slate-400">Placa</p>

              <p className="mt-1 text-sm font-bold text-slate-800">
                {selectedVehicle.plate}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[9px] text-slate-400">Conductor</p>

              <p className="mt-1 truncate text-sm font-bold text-slate-800">
                {selectedVehicle.driver}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionGarbage;
