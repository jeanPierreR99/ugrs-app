"use client";

import { Search, X } from "lucide-react";
import { Vehicle } from "./GarbageTracking";
import React from "react";

interface Props {
  setSearchOpen: any;
  searchOpen: any;
  search: any;
  setSearch: any;
  filteredVehicles: Vehicle[] | [];
  setSelectedVehicle: any;
  setSheetExpanded: any;
}
const HeaderSearch: React.FC<Props> = ({
  setSearchOpen,
  searchOpen,
  search,
  setSearch,
  filteredVehicles,
  setSelectedVehicle,
  setSheetExpanded,
}) => {
  return (
    <div className="absolute left-0 right-0 top-0 z-[1000] px-3 pt-3 sm:px-4">
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl bg-white/95 p-3 shadow-xl backdrop-blur">
          <div className="flex items-center gap-3">
            <div className=" flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-xl shadow-sm">
              🚛
            </div>
            <div className="min-w-0 flex-1">
              <p className=" text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                Municipalidad Provincial
              </p>
              <h1 className=" truncate text-sm font-bold text-slate-900">
                Recolección de residuos
              </h1>
            </div>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className=" flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition active:scale-95"
            >
              {searchOpen ? <X size={19} /> : <Search size={19} />}
            </button>
          </div>

          {/* SEARCH */}

          {searchOpen && (
            <div className="mt-3">
              <div className=" flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
                <Search size={17} className="text-slate-400" />
                <input
                  autoFocus
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar vehículo o ruta..."
                  className=" w-full bg-transparent py-3 text-sm outline-none"
                />
              </div>

              {search && (
                <div className=" mt-2 max-h-52 overflow-auto rounded-xl border border-slate-100 bg-white">
                  {filteredVehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setSearch("");
                        setSearchOpen(false);
                        setSheetExpanded(true);
                      }}
                      className=" flex w-full items-center gap-3 border-b border-slate-100 p-3 text-left last:border-0 active:bg-slate-50"
                    >
                      <span className="text-xl">🚛</span>
                      <div className="min-w-0">
                        <p className=" text-sm font-bold text-slate-800">
                          {vehicle.code}
                        </p>

                        <p className=" truncate text-xs text-slate-500">
                          {vehicle.route}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderSearch;
