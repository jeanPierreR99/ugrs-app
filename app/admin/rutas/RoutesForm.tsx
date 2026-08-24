"use client";

import dynamic from "next/dynamic";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createRoute } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const RouteMapEditor = dynamic(
  () => import("@/components/admin/RouteMapEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[600px] items-center justify-center rounded-2xl bg-slate-100">
        <span className="text-sm text-slate-500">Cargando mapa...</span>
      </div>
    ),
  },
);

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

interface RoutesFormProps {
  routes: ExistingRoute[];
}

export default function RoutesForm({ routes }: RoutesFormProps) {
  const router = useRouter();

  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#10b981",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const saveRoute = async () => {
    setError("");

    if (!form.name) {
      setError("Completa el nombre de la ruta.");
      toast.warning("Completa el nombre de la ruta.");
      return;
    }

    if (points.length < 2) {
      setError("Debes registrar al menos dos puntos en el mapa.");
      toast.warning("Debes registrar al menos dos puntos en el mapa.");
      return;
    }

    setSaving(true);

    const result = await createRoute({
      name: form.name,
      description: form.description || null,
      color: form.color,
      routePath: points,
    });

    setSaving(false);

    if (!result.success) {
      setError(result.message);
      toast.error(result.message);
      return;
    }

    toast.success("Ruta creada exitosamente");

    router.refresh();
  };

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Registrar ruta
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Define el recorrido que realizará el vehículo.
          </p>
        </div>
      </div>

      <div className="grid h-[calc(100vh-220px)] gap-6 xl:grid-cols-[380px_1fr]">
        {/* FORMULARIO */}
        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-slate-800">Información de la ruta</h2>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Nombre de ruta
              </label>

              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Ej. Sector 01"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Color
              </label>

              <input
                value={form.color}
                type="color"
                onChange={(e) =>
                  setForm({
                    ...form,
                    color: e.target.value,
                  })
                }
                className="h-11 w-full rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Descripción
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Descripción de la ruta..."
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-bold text-slate-500">RECORRIDO</p>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                Punto inicial
              </div>

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                Punto final
              </div>

              <p className="pt-2 text-slate-400">
                Puntos registrados:{" "}
                <strong className="text-slate-700">{points.length}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={saveRoute}
            disabled={saving || !form.name || points.length < 2}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save size={18} />
            {saving ? "Guardando..." : "Guardar ruta"}
          </button>
        </div>

        {/* MAPA */}
        <RouteMapEditor onChange={setPoints} existingRoutes={routes} />
      </div>
    </>
  );
}
