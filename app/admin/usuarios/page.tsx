"use client";

import { Plus, Search, MoreVertical, UserCheck, UserX } from "lucide-react";

import { useState } from "react";

import AdminLayout from "@/components/admin/AdminLayout";

const INITIAL_USERS = [
  {
    id: 1,
    name: "Jean Pierre",
    username: "jpierre",
    role: "Administrador",
    status: "ACTIVO",
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    username: "cmendoza",
    role: "Operador",
    status: "ACTIVO",
  },
  {
    id: 3,
    name: "Luis Quispe",
    username: "lquispe",
    role: "Operador",
    status: "INACTIVO",
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const users = INITIAL_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Usuarios</h1>

          <p className="mt-1 text-sm text-slate-400">
            Administra los usuarios que tienen acceso al sistema.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700">
          <Plus size={18} />
          Nuevo usuario
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        {/* SEARCH */}
        <div className="border-b border-slate-100 p-5">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar usuario..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                  Usuario
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                  Rol
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                  Estado
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-400">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                        {user.name
                          .split(" ")
                          .map((x) => x[0])
                          .slice(0, 2)
                          .join("")}
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          {user.name}
                        </p>

                        <p className="text-xs text-slate-400">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-500">
                    {user.role}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`
                        rounded-full px-3 py-1 text-[10px] font-bold
                        ${
                          user.status === "ACTIVO"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-500"
                        }
                      `}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        title={
                          user.status === "ACTIVO" ? "Dar de baja" : "Activar"
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                      >
                        {user.status === "ACTIVO" ? (
                          <UserX size={18} />
                        ) : (
                          <UserCheck size={18} />
                        )}
                      </button>

                      <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
