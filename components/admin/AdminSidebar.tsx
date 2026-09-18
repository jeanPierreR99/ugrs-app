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
import { toast } from "sonner";

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

interface AdminSidebarProps {
  collapse: boolean;
  setCollapse: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminSidebar({
  collapse,
  setCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("No se pudo cerrar la sesión");
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.warning("Ocurrió un error al cerrar sesión");
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-white/10 bg-emerald-900 text-white shadow-2xl shadow-black/20 transition-all duration-300 ${collapse ? "w-[78px]" : "w-[260px]"
        }`}
    >
      {/* LOGO */}
      <div className="flex flex-col gap-4 mt-10 h-[120px] justify-center items-center border-b border-white/10 px-5">
        <div className="flex min-w-0 flex-csol items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
            <img src="/logo-solo.png" alt="" />
          </div>

          {!collapse && (
            <div>
              <p className="text-sm font-bold tracking-wide text-white">
                MUNICIPALIDAD PROVINCIAL
              </p>
              <p className="text-xs text-yellow-200">DE TAMBOPATA</p>
            </div>
          )}
        </div>

        {!collapse && (
          <div className="min-w-0">
            <p className=" text-[10px] font-medium text-center uppercase tracking-[0.18em] text-emerald-400">
              Sistema de Gestión de residuos Sólidos
            </p>
          </div>
        )}
      </div>

      {/* TÍTULO DEL MENÚ */}
      <div className="px-5 pt-6">
        {!collapse && (
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
              title={collapse ? item.title : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${active
                ? "bg-emerald-500/10 text-emerald-400"
                : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                }`}
            >
              {active && (
                <span className="absolute left-0 h-7 w-1 rounded-r-full bg-emerald-500" />
              )}

              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${active
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-white/[0.04] text-slate-500 group-hover:bg-white/[0.07] group-hover:text-slate-300"
                  }`}
              >
                <Icon size={18} />
              </div>

              {!collapse && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapse && (
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

      <div className="space-y-1 border-t border-white/10 p-3">
        <button
          type="button"
          onClick={() => {
            handleLogout();
          }}
          title={collapse ? "Cerrar sesión" : undefined}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
            <LogOut size={18} />
          </div>

          {!collapse && <span>Cerrar sesión</span>}
        </button>

        <div className="py-1" />

        <button
          type="button"
          onClick={() => setCollapse(!collapse)}
          className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] py-2 text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
        >
          {collapse ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
