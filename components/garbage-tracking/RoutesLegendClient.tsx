"use client";

import {
    ChevronRight,
    Clock3,
    MapPinned,
    Route as RouteIcon,
    X,
} from "lucide-react";
import { useState } from "react";

interface RouteItem {
    id: string;
    name: string;
    description: string | null;
    color: string;
}

interface Props {
    routes: RouteItem[];
}

export default function RoutesLegend({ routes }: Props) {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="absolute bottom-55 right-4 z-[1000]">
            {open && (
                <div
                    className="
                        absolute -bottom-54 right-0
                        w-[340px]
                        max-w-[calc(100vw-2rem)]
                        rounded-2xl
                        border border-white/30
                        bg-white/95
                        shadow-2xl
                        backdrop-blur-xl
                        animate-in
                        fade-in
                        slide-in-from-bottom-2
                        duration-700
                    "
                >
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200">
                                <RouteIcon className="h-4 w-4 text-gray-800" />
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-slate-800">
                                    Rutas de recolección
                                </h3>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="
                                flex h-8 w-8 items-center justify-center
                                rounded-lg
                                text-slate-400
                                transition
                                hover:bg-slate-100
                                hover:text-slate-700
                            "
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                            Rutas disponibles
                        </span>

                        <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                            {routes.length}
                        </span>
                    </div>

                    <div
                        className="
                            max-h-80 overflow-auto
                            overflow-y-auto
                            p-2
                            scrollbar-thin
                            scrollbar-thumb-slate-300
                            scrollbar-track-transparent
                        "
                    >
                        <div className="space-y-1.5">
                            {routes.map((route) => (
                                <button
                                    key={route.id}
                                    type="button"
                                    className="
                                        group
                                        relative
                                        flex
                                        w-full
                                        items-center
                                        gap-3
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-transparent
                                        bg-slate-50
                                        px-3
                                        py-2.5
                                        text-left
                                        transition-all
                                        duration-200
                                        hover:border-slate-200
                                        hover:bg-white
                                        hover:shadow-sm
                                    "
                                >
                                    <div
                                        className="absolute left-0 top-0 h-full w-[4px]"
                                        style={{
                                            backgroundColor: route.color,
                                        }}
                                    />

                                    <div
                                        className="
                                            ml-1
                                            flex
                                            h-9
                                            w-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg
                                            border
                                        "
                                        style={{
                                            backgroundColor: `${route.color}12`,
                                            borderColor: `${route.color}35`,
                                        }}
                                    >
                                        <MapPinned
                                            className="h-4 w-4"
                                            style={{
                                                color: route.color,
                                            }}
                                        />
                                    </div>

                                    {/* INFORMACIÓN */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="h-1.5 w-1.5 shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        route.color,
                                                }}
                                            />

                                            <h4
                                                className="truncate text-[13px] font-semibold text-slate-800"
                                                style={{
                                                    color: route.color,
                                                }}
                                            >
                                                {route.name}
                                            </h4>
                                        </div>

                                        {route.description && (
                                            <div className="mt-1 flex items-start gap-1.5">
                                                <Clock3 className="mt-[2px] h-3 w-3 shrink-0 text-slate-400" />

                                                <p className="whitespace-pre-line text-[10px] leading-relaxed text-slate-500">
                                                    {route.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="border-t border-slate-100 px-4 py-2.5">
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                            <span className="text-[10px] text-slate-400">
                                Sistema de monitoreo activo
                            </span>
                        </div>
                    </div>
                </div>
            )}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-label={open ? "Cerrar rutas" : "Mostrar rutas"}
                className="
                    group
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/60
                    bg-white/95
                    text-slate-700
                    shadow-xl
                    backdrop-blur-xl
                    transition-all
                    duration-200
                    hover:scale-105
                    hover:bg-white
                    active:scale-95
                "
            >
                {open ? (
                    <X className="h-5 w-5" />
                ) : (
                    <RouteIcon
                        className="
                            h-5 w-5
                            transition-transform
                            duration-200
                            group-hover:rotate-6
                        "
                    />
                )}

                {!open && routes.length > 0 && (
                    <span
                        className="
                            absolute
                            -right-0.5
                            -top-0.5
                            flex
                            h-5
                            min-w-5
                            items-center
                            justify-center
                            rounded-full
                            border-2
                            border-white
                            bg-slate-900
                            px-1
                            text-[9px]
                            font-bold
                            text-white
                        "
                    >
                        {routes.length}
                    </span>
                )}
            </button>
        </div>
    );
}