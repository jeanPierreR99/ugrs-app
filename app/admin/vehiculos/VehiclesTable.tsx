"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPinned, MoreVertical, Pencil, Plus, Search, X } from "lucide-react";
import { createVehicle, updateVehicle } from "./actions";
import { vehicleSchema, type VehicleFormData } from "./vehicle.schema";
import { toast } from "sonner";

interface Driver {
  id: string;
  name: string;
  lastname: string;
}

interface Route {
  id: string;
  name: string;
  description: string | null;
}

interface Vehicle {
  id: string;
  plate: string;
  status: "EN_RUTA" | "DETENIDO";
  drivers: {
    driver: Driver;
  }[];
  routes: {
    route: Route;
  }[];
}

interface VehiclesTableProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  routes: Route[];
}

export default function VehiclesTable({
  vehicles,
  drivers,
  routes,
}: VehiclesTableProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plate: "",
      driverIds: [],
      routeIds: [],
    },
  });

  const filteredVehicles = vehicles.filter((vehicle) => {
    const value = search.toLowerCase();

    const driverNames = vehicle.drivers
      .map((item) => `${item.driver.name} ${item.driver.lastname}`)
      .join(" ");

    return (
      vehicle.plate.toLowerCase().includes(value) ||
      driverNames.toLowerCase().includes(value) ||
      vehicle.routes.some((item) =>
        item.route.name.toLowerCase().includes(value),
      )
    );
  });

  const openCreate = () => {
    setEditingVehicle(null);

    reset({
      plate: "",
      driverIds: [],
      routeIds: [],
    });

    setServerError("");
    setShowVehicleModal(true);
  };

  const openEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);

    reset({
      plate: vehicle.plate,
      driverIds: vehicle.drivers.map((item) => item.driver.id),
      routeIds: vehicle.routes.map((item) => item.route.id),
    });

    setServerError("");
    setShowVehicleModal(true);
  };

  const closeVehicleModal = () => {
    if (isSubmitting) return;

    setShowVehicleModal(false);
    setEditingVehicle(null);
    setServerError("");
    reset();
  };

  const onSubmit = async (data: VehicleFormData) => {
    setServerError("");

    const result = editingVehicle
      ? await updateVehicle(editingVehicle.id, data)
      : await createVehicle(data);

    if (!result.success) {
      setServerError(result.message);
      toast.warning(result.message);
      return;
    }

    reset();
    setEditingVehicle(null);
    setShowVehicleModal(false);
    router.refresh();
  };

  return (
    <>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Vehículos</h1>
          <p className="mt-1 text-sm text-slate-400">
            Registra y administra los vehículos recolectores.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
        >
          <Plus size={18} />
          Registrar vehículo
        </button>
      </div>

      <div className="mb-5 flex max-w-md items-center rounded-xl border border-slate-200 bg-white">
        <Search size={18} className="ml-3 text-slate-400" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar vehículo..."
          className="h-11 flex-1 bg-transparent px-3 text-sm outline-none"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                  🚛
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-800">
                    {vehicle.plate}
                  </h3>

                  <p className="text-xs text-slate-400">
                    {vehicle.drivers.length > 0
                      ? `${vehicle.drivers.length} conductor${vehicle.drivers.length > 1 ? "es" : ""}`
                      : "Sin conductores"}
                  </p>
                </div>
              </div>

              <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <span className="text-sm text-slate-400">Conductores</span>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {vehicle.drivers.length > 0 ? (
                    vehicle.drivers.map((item) => (
                      <span
                        key={item.driver.id}
                        className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700"
                      >
                        {item.driver.name} {item.driver.lastname}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">
                      Sin conductores asignados
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Rutas asignadas</span>

                <span className="font-semibold text-slate-700">
                  {vehicle.routes.length}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {vehicle.routes.slice(0, 3).map((item) => (
                  <span
                    key={item.route.id}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600"
                  >
                    {item.route.name}
                  </span>
                ))}

                {vehicle.routes.length > 3 && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                    +{vehicle.routes.length - 3}
                  </span>
                )}

                {vehicle.routes.length === 0 && (
                  <span className="text-xs text-slate-400">
                    Sin rutas asignadas
                  </span>
                )}
              </div>

              <div>
                <span
                  className={
                    vehicle.status === "EN_RUTA"
                      ? "rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600"
                      : "rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-600"
                  }
                >
                  {vehicle.status === "EN_RUTA" ? "EN RUTA" : "DETENIDO"}
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                onClick={() => openEdit(vehicle)}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                <Pencil size={15} />
                Editar
              </button>

              <button
                onClick={() => {
                  window.location.href = "/admin/monitoreo";
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
              >
                <MapPinned size={15} />
                Monitorear
              </button>
            </div>
          </div>
        ))}
      </div>

      {showVehicleModal && (
        <>
          <div
            className="fixed inset-0 z-40 animate-[fadeIn_200ms_ease-out] bg-black/30"
            onClick={closeVehicleModal}
          />

          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md animate-[slideIn_250ms_ease-out] bg-white shadow-2xl">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">
                    {editingVehicle ? "Editar vehículo" : "Registrar vehículo"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {editingVehicle
                      ? "Editar Vehículo"
                      : "Registra un nuevo vehículo recolector."}
                  </p>
                </div>

                <button
                  onClick={closeVehicleModal}
                  disabled={isSubmitting}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <form
                  id="create-vehicle-form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {serverError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {serverError}
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Placa
                    </label>

                    <input
                      {...register("plate")}
                      type="text"
                      placeholder="Ej. EAB-245"
                      className={
                        errors.plate
                          ? "h-11 w-full rounded-xl border border-red-300 bg-red-50 px-4 text-sm uppercase outline-none focus:border-red-500"
                          : "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm uppercase outline-none focus:border-emerald-500"
                      }
                    />

                    {errors.plate && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.plate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Conductores
                    </label>

                    <div className="space-y-2 h-50 overflow-y-auto">
                      {drivers.map((driver) => (
                        <label
                          key={driver.id}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-slate-100"
                        >
                          <input
                            type="checkbox"
                            value={driver.id}
                            {...register("driverIds")}
                            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />

                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              {driver.name} {driver.lastname}
                            </p>

                            <p className="text-xs text-slate-400">Conductor</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    <p className="mt-1.5 text-xs text-slate-400">
                      Puedes seleccionar uno o varios conductores.
                    </p>

                    {errors.driverIds && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.driverIds.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Rutas
                    </label>

                    <div className="h-50 space-y-2 overflow-y-auto">
                      {routes.length > 0 ? (
                        routes.map((route) => (
                          <label
                            key={route.id}
                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-slate-100"
                          >
                            <input
                              type="checkbox"
                              value={route.id}
                              {...register("routeIds")}
                              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />

                            <div>
                              <p className="text-sm font-semibold text-slate-700">
                                {route.name}
                              </p>

                              {route.description && (
                                <p className="text-xs text-slate-400">
                                  {route.description}
                                </p>
                              )}
                            </div>
                          </label>
                        ))
                      ) : (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <p className="text-xs text-slate-400">
                            No hay rutas registradas.
                          </p>
                        </div>
                      )}
                    </div>

                    <p className="mt-1.5 text-xs text-slate-400">
                      Puedes seleccionar una o varias rutas.
                    </p>

                    {errors.routeIds && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.routeIds.message}
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-xs leading-5 text-slate-500">
                      Las rutas se asignarán posteriormente desde la
                      administración de rutas.
                    </p>
                  </div>
                </form>
              </div>

              <div className="flex gap-3 border-t border-slate-100 p-6">
                <button
                  type="button"
                  onClick={closeVehicleModal}
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  form="create-vehicle-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? editingVehicle
                      ? "Guardando..."
                      : "Registrando..."
                    : editingVehicle
                      ? "Guardar cambios"
                      : "Registrar vehículo"}{" "}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
