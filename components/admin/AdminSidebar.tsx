"use client";

import {
  LayoutDashboard,
  Users,
  Truck,
  Route,
  MapPinned,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menu = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Usuarios",
    href: "/admin/usuarios",
    icon: Users,
  },
  {
    title: "Vehículos",
    href: "/admin/vehiculos",
    icon: Truck,
  },
  {
    title: "Rutas",
    href: "/admin/rutas",
    icon: Route,
  },
  {
    title: "Monitoreo",
    href: "/admin/monitoreo",
    icon: MapPinned,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-white/10 bg-emerald-900 text-white shadow-2xl shadow-black/20 transition-all duration-300 ${
        collapsed ? "w-[78px]" : "w-[260px]"
      }`}
    >
      {/* LOGO */}
      <div className="flex flex-col gap-4 mt-10 h-[120px] justify-center items-center border-b border-white/10 px-5">
        <div className="flex min-w-0 flex-csol items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
            <img src="/logo-solo.png" alt="" />
          </div>

          {!collapsed && (
            <div>
              <p className="text-sm font-bold tracking-wide text-white">
                MUNICIPALIDAD PROVINCIAL
              </p>
              <p className="text-xs text-yellow-200">DE TAMBOPATA</p>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <p className=" text-[10px] font-medium text-center uppercase tracking-[0.18em] text-emerald-400">
              Sistema de Gestión de residuos Sólidos
            </p>
          </div>
        )}
      </div>

      {/* TÍTULO DEL MENÚ */}
      <div className="px-5 pt-6">
        {!collapsed && (
          <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
            Administración
          </p>
        )}
      </div>

      {/* MENÚ */}
      <nav className="flex-1 space-y-1 px-3">
        {menu.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.title : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                active
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {/* INDICADOR ACTIVO */}
              {active && (
                <span className="absolute left-0 h-7 w-1 rounded-r-full bg-emerald-500" />
              )}

              {/* ICONO */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                  active
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-white/[0.04] text-slate-500 group-hover:bg-white/[0.07] group-hover:text-slate-300"
                }`}
              >
                <Icon size={18} />
              </div>

              {!collapsed && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ESTADO DEL SISTEMA */}
      {!collapsed && (
        <div className="mx-3 mb-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>

            <span className="text-xs font-medium text-slate-300">
              Sistema operativo
            </span>
          </div>

          <p className="mt-1 pl-4 text-[10px] text-slate-300">
            Monitoreo en tiempo real activo
          </p>
        </div>
      )}

      {/* PARTE INFERIOR */}
      <div className="space-y-1 border-t border-white/10 p-3">
        {/* CONFIGURACIÓN */}
        <Link
          href="/admin/configuracion"
          title={collapsed ? "Configuración" : undefined}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
            <Settings size={18} />
          </div>

          {!collapsed && <span>Configuración</span>}
        </Link>

        {/* CERRAR SESIÓN */}
        <button
          type="button"
          onClick={() => {
            console.log("Cerrar sesión");
          }}
          title={collapsed ? "Cerrar sesión" : undefined}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
            <LogOut size={18} />
          </div>

          {!collapsed && <span>Cerrar sesión</span>}
        </button>

        {/* SEPARADOR */}
        <div className="py-1" />

        {/* COLAPSAR SIDEBAR */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] py-2 text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
