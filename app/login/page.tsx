"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  MapPinned,
  User,
  Truck,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      return;
    }

    setLoading(true);

    // Aquí posteriormente conectarás:
    // POST /api/auth/login

    setTimeout(() => {
      setLoading(false);
      console.log(form);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* =====================================================
            PANEL IZQUIERDO
        ====================================================== */}
        <section className="relative hidden overflow-hidden bg-emerald-900 lg:flex">
          {/* Decoración */}
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-700/40 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-3xl" />

          {/* Líneas decorativas */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-[15%] top-0 h-full w-px bg-white" />
            <div className="absolute left-[35%] top-0 h-full w-px bg-white" />
            <div className="absolute left-[55%] top-0 h-full w-px bg-white" />
            <div className="absolute left-[75%] top-0 h-full w-px bg-white" />

            <div className="absolute left-0 top-[25%] h-px w-full bg-white" />
            <div className="absolute left-0 top-[50%] h-px w-full bg-white" />
            <div className="absolute left-0 top-[75%] h-px w-full bg-white" />
          </div>

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-23 w-23 items-center justify-center rounded-2x drop-shadow-xl">
                <img src="./logo-solo.png" alt="" />
              </div>

              <div>
                <p className="text-sm font-bold tracking-wide text-white">
                  MUNICIPALIDAD PROVINCIAL
                </p>
                <p className="text-xs text-yellow-200">DE TAMBOPATA</p>
              </div>
            </div>

            {/* Contenido */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-800/60 px-4 py-2 text-xs font-semibold text-emerald-100 backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                SISTEMA DE MONITOREO
              </div>

              <h1 className="text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                Monitoreo y seguimiento de
                <span className="block text-emerald-300">
                  vehículos recolectores
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-emerald-100/80">
                Supervisa en tiempo real el recorrido de los vehículos
                recolectores de residuos sólidos y verifica el avance de sus
                rutas asignadas.
              </p>

              {/* Vehículo ilustrativo */}
              <div className="relative mt-14 h-32">
                {/* Ruta */}
                <div className="absolute left-0 right-0 top-16 border-t-2 border-dashed border-emerald-400/40" />

                {/* Puntos */}
                <div className="absolute left-[8%] top-[52px] h-4 w-4 rounded-full border-2 border-emerald-300 bg-emerald-700" />

                <div className="absolute left-[45%] top-[52px] h-4 w-4 rounded-full border-2 border-emerald-300 bg-emerald-700" />

                <div className="absolute right-[5%] top-[52px] h-4 w-4 rounded-full border-2 border-emerald-300 bg-emerald-700" />

                {/* Camión */}
                <div className="absolute left-[42%] -top-2 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white text-5xl shadow-2xl">
                  🚛
                </div>

                <div className="absolute left-[39%] top-[88px] text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Vehículo en ruta
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 text-xs text-emerald-200/70">
              <ShieldCheck size={16} />
              Plataforma institucional de monitoreo
            </div>
          </div>
        </section>

        {/* =====================================================
            PANEL DERECHO
        ====================================================== */}
        <section className="flex min-h-screen items-center justify-center bg-white px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            {/* Logo móvil */}
            <div className="flex items-center gap-3 mb-3 lg:hidden">
              <div className="flex h-16 w-16 items-center justify-center rounded-2x drop-shadow-xl">
                <img src="./logo-solo.png" alt="" />
              </div>

              <div>
                <p className="text-sm font-bold tracking-wide text-black">
                  MUNICIPALIDAD PROVINCIAL
                </p>
                <p className="text-xs text-red-600">DE TAMBOPATA</p>
              </div>
            </div>

            {/* Encabezado */}
            <div className="mb-8">
              <div className="mb-5 h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 hidden lg:flex">
                <Truck size={28} className="text-emerald-600" />
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Bienvenido
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Ingresa tus credenciales para acceder al sistema de monitoreo.
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Usuario */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Usuario
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="username"
                    type="text"
                    value={form.username}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        username: e.target.value,
                      })
                    }
                    placeholder="Ingresa tu usuario"
                    autoComplete="username"
                    className="
                      h-13 w-full rounded-xl
                      border border-slate-200
                      bg-slate-50
                      pl-11 pr-4
                      text-sm text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-emerald-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-emerald-500/10
                    "
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Contraseña
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    placeholder="Ingresa tu contraseña"
                    autoComplete="current-password"
                    className="
                      h-13 w-full rounded-xl
                      border border-slate-200
                      bg-slate-50
                      pl-11 pr-12
                      text-sm text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-emerald-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-emerald-500/10
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                      absolute right-3 top-1/2
                      -translate-y-1/2
                      rounded-lg p-2
                      text-slate-400
                      transition
                      hover:bg-slate-100
                      hover:text-slate-600
                    "
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Recordar */}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        remember: e.target.checked,
                      })
                    }
                    className="
                      h-4 w-4
                      rounded
                      border-slate-300
                      text-emerald-600
                      focus:ring-emerald-500
                    "
                  />

                  <span className="text-sm text-slate-500">Recordarme</span>
                </label>

                <button
                  type="button"
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Botón */}
              <button
                type="submit"
                disabled={loading || !form.username || !form.password}
                className="
                  flex h-13 w-full
                  items-center justify-center
                  rounded-xl
                  bg-emerald-600
                  px-5
                  text-sm font-bold
                  text-white
                  shadow-lg
                  shadow-emerald-600/20
                  transition
                  hover:bg-emerald-700
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span
                      className="
                        h-4 w-4 animate-spin
                        rounded-full border-2
                        border-white/30
                        border-t-white
                      "
                    />
                    Ingresando...
                  </div>
                ) : (
                  "Ingresar al sistema"
                )}
              </button>
            </form>

            {/* Información */}
            <div className="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex gap-3">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <div>
                  <p className="text-xs font-bold text-slate-700">
                    Acceso institucional
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    El acceso al sistema está restringido a usuarios
                    autorizados.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="mt-8 text-center text-xs text-slate-400">
              Sistema Georreferenciado de Monitoreo y Seguimiento
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
