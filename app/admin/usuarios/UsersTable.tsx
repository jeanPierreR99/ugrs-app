"use client";

import { Pencil, Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UserFormData, userSchema } from "./user.schema";
import { createUser, updateUser } from "./actions";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: "ADMIN" | "CONDUCTOR" | "SISTEMA";
  status: boolean;
}

interface UsersTableProps {
  users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
  const [usersList, setUsersList] = useState<User[]>(users);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [serverError, setServerError] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      password: "",
      role: "CONDUCTOR",
      status: true
    },
  });

  const filteredUsers = usersList.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(value) ||
      user.lastname.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value)
    );
  });

  const onSubmit = async (data: UserFormData) => {
    setServerError("");

    if (editingUser) {
      const result = await updateUser(editingUser.id, data);

      if (!result.success) {
        setServerError(result.message);
        toast.warning(result.message);
        return;
      }

      setUsersList((currentUsers) =>
        currentUsers.map((user) =>
          user.id === editingUser.id ? result.user! : user
        )
      );

      toast.success("Usuario actualizado exitosamente");

      handleCloseModal();

      return;
    }

    const result = await createUser(data);

    if (!result.success) {
      setServerError(result.message);
      toast.warning(result.message);
      return;
    }

    setUsersList((currentUsers) => [result.user, ...currentUsers]);

    toast.success("Usuario creado exitosamente");

    handleCloseModal();
  };

  /**
   * ABRIR MODAL PARA CREAR
   */
  const handleOpenCreate = () => {
    setEditingUser(null);

    reset({
      name: "",
      lastname: "",
      email: "",
      password: "",
      role: "CONDUCTOR",
      status: true,
    });

    setServerError("");
    setShowCreate(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);

    reset({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status
    });

    setServerError("");
    setShowCreate(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;

    reset();
    setServerError("");
    setEditingUser(null);
    setShowCreate(false);
  };

  useEffect(() => {
    setUsersList(users);
  }, [users]);

  return (
    <>
      {/* HEADER */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Usuarios
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Administra los usuarios que tienen acceso al sistema.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
        >
          <Plus size={18} />
          Nuevo usuario
        </button>
      </div>

      {/* TABLA */}
      <div className="rounded-2xl border border-slate-200 bg-white">
        {/* SEARCH */}
        <div className="border-b border-slate-100 p-5">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
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
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                >
                  {/* USER */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                        {`${user.name[0] ?? ""}${user.lastname[0] ?? ""} `.toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          {user.name} {user.lastname}
                        </p>

                        <p className="text-xs text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ROLE */}
                  <td className="px-5 py-4">
                    <span
                      className={
                        user.role !== "ADMIN"
                          ? "rounded-full bg-cyan-50 px-3 py-1 text-[10px] font-bold text-cyan-600"
                          : "rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-500"
                      }
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4">
                    <span
                      className={
                        user.status
                          ? "rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600"
                          : "rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold text-red-500"
                      }
                    >
                      {user.status ? "ACTIVO" : "INACTIVO"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        title="Editar usuario"
                        type="button"
                        onClick={() => handleOpenEdit(user)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                      >
                        <Pencil size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREATE / EDIT */}
      {showCreate && (
        <>
          {/* OVERLAY */}
          <div
            className="fixed inset-0 z-40 animate-[fadeIn_200ms_ease-out] bg-black/30"
            onClick={handleCloseModal}
          />

          {/* DRAWER */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md animate-[slideIn_250ms_ease-out] bg-white shadow-2xl">
            <div className="flex h-full flex-col">
              {/* HEADER */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">
                    {editingUser ? "Editar usuario" : "Nuevo usuario"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {editingUser
                      ? "Actualiza la información del usuario."
                      : "Registra un nuevo usuario para el sistema."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              {/* ERROR */}
              {serverError && (
                <div className="mx-6 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {serverError}
                </div>
              )}

              {/* FORM */}
              <div className="flex-1 overflow-y-auto p-6">
                <form
                  id="user-form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* NAME */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Nombre
                    </label>

                    <input
                      {...register("name")}
                      type="text"
                      placeholder="Ej. Juan"
                      className={
                        errors.name
                          ? "h-11 w-full rounded-xl border border-red-300 bg-red-50 px-4 text-sm outline-none focus:border-red-500"
                          : "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-emerald-500"
                      }
                    />

                    {errors.name && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* LASTNAME */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Apellidos
                    </label>

                    <input
                      {...register("lastname")}
                      type="text"
                      placeholder="Ej. Pérez García"
                      className={
                        errors.lastname
                          ? "h-11 w-full rounded-xl border border-red-300 bg-red-50 px-4 text-sm outline-none focus:border-red-500"
                          : "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-emerald-500"
                      }
                    />

                    {errors.lastname && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.lastname.message}
                      </p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Correo electrónico
                    </label>

                    <input
                      {...register("email")}
                      type="email"
                      placeholder="usuario@ugrs.local"
                      className={
                        errors.email
                          ? "h-11 w-full rounded-xl border border-red-300 bg-red-50 px-4 text-sm outline-none focus:border-red-500"
                          : "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-emerald-500"
                      }
                    />

                    {errors.email && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Contraseña
                      {editingUser && (
                        <span className="ml-2 text-xs font-normal text-slate-400">
                          (opcional)
                        </span>
                      )}
                    </label>

                    <input
                      {...register("password")}
                      type="password"
                      placeholder={
                        editingUser
                          ? "Dejar vacío para conservarla"
                          : "••••••••"
                      }
                      className={
                        errors.password
                          ? "h-11 w-full rounded-xl border border-red-300 bg-red-50 px-4 text-sm outline-none focus:border-red-500"
                          : "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-emerald-500"
                      }
                    />

                    {errors.password && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Estado
                    </label>

                    <select
                      {...register("status", {
                        setValueAs: (value) => value === "true",
                      })}
                      className={
                        errors.status
                          ? "h-11 w-full rounded-xl border border-red-300 bg-red-50 px-4 text-sm outline-none focus:border-red-500"
                          : "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-emerald-500"
                      }
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>

                    {errors.status && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.status.message}
                      </p>
                    )}

                    {errors.role && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.role.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Rol
                    </label>

                    <select
                      {...register("role")}
                      className={
                        errors.role
                          ? "h-11 w-full rounded-xl border border-red-300 bg-red-50 px-4 text-sm outline-none focus:border-red-500"
                          : "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-emerald-500"
                      }
                    >
                      <option value="CONDUCTOR">Conductor</option>
                      <option value="ADMIN">Administrador</option>
                    </select>

                    {errors.role && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.role.message}
                      </p>
                    )}
                  </div>
                </form>
              </div>

              {/* FOOTER */}
              <div className="flex gap-3 border-t border-slate-100 p-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  form="user-form"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? editingUser
                      ? "Guardando..."
                      : "Creando..."
                    : editingUser
                      ? "Guardar cambios"
                      : "Crear usuario"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}