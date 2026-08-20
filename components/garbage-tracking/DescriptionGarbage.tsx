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
  if (distance < 1000) {
    return `${Math.round(distance)} m`;
  }

  return `${(distance / 1000).toFixed(1)} km`;
};

const DescriptionGarbage: React.FC<Props> = ({
  selectedVehicle,
  setSheetExpanded,
  sheetExpanded,
  distance,
  locateUser,
}) => {
  if (!selectedVehicle) return null;

  const isActive = selectedVehicle.status === "EN_RUTA";

  return (
    <div className="absolute inset-x-0 bottom-0 z-[800] mx-auto w-full max-w-xl">
      <div className="rounded-t-[28px] bg-white px-4 pb-5 pt-3 shadow-[0_-10px_40px_rgba(0,0,0,0.12)]">
        {/* Handle */}

        <button
          type="button"
          onClick={() => setSheetExpanded(!sheetExpanded)}
          className="mx-auto mb-4 block h-1.5 w-12 rounded-full bg-slate-200"
        />

        {/* Header */}

        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
              <Truck size={24} className="text-emerald-600" />

              {isActive && (
                <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  {selectedVehicle.code}
                </h2>

                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  EN RUTA
                </span>
              </div>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                {selectedVehicle.route}
              </p>
            </div>
          </div>

          {/* Última actualización */}

          <div className="flex shrink-0 items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1.5 text-[9px] font-medium text-slate-500">
            <Radio size={11} className="text-emerald-500" />
            {selectedVehicle.updatedAt}s
          </div>
        </div>

        {/* Ruta */}

        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
            <Route size={18} className="text-blue-600" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[9px] text-slate-400">Ruta asignada</p>

            <p className="mt-1 truncate text-xs font-semibold text-slate-800">
              {selectedVehicle.route}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold text-emerald-600">
              {selectedVehicle.progress}%
            </p>

            <p className="text-[9px] text-slate-400">recorrido</p>
          </div>
        </div>

        {/* Barra de progreso */}

        <div className="mt-3">
          <div className="mb-1 flex justify-between">
            <span className="text-[9px] text-slate-400">Progreso de ruta</span>

            <span className="text-[9px] font-semibold text-slate-600">
              {selectedVehicle.progress}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${selectedVehicle.progress}%`,
              }}
            />
          </div>
        </div>

        {/* Estadísticas */}

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
            value={`${selectedVehicle.progress}%`}
            color="text-blue-600"
          />

          <InfoCard
            icon={<Clock3 size={17} />}
            label="Actualizado"
            value={`${selectedVehicle.updatedAt}s`}
            color="text-orange-500"
          />
        </div>

        {/* Distancia */}

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

        {/* Información adicional */}

        {sheetExpanded && (
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
        )}
      </div>
    </div>
  );
};

export default DescriptionGarbage;
