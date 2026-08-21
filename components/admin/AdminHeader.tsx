"use client";

import { Bell, Search } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <p className="text-lg font-bold text-slate-800">Panel administrativo</p>

        <p className="text-xs text-slate-400">
          Gestión del sistema de monitoreo
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 sm:flex">
          <Search size={19} />
        </button>

        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50">
          <Bell size={19} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
            JP
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-bold text-slate-700">Administrador</p>

            <p className="text-[11px] text-slate-400">
              Administrador del sistema
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
