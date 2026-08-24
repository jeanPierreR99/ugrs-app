"use server";

import { prisma } from "@/lib/prisma";

interface CreateRouteData {
    name: string;
    description: string | null;
    color: string;
    routePath: {
        lat: number;
        lng: number;
    }[];
}

export async function createRoute(data: CreateRouteData) {
    try {
        const existingRoute = await prisma.route.findFirst({
            where: {
                name: data.name,
            },
        });

        if (existingRoute) {
            return {
                success: false,
                message: "Ya existe una ruta con ese nombre.",
            };
        }

        const route = await prisma.route.create({
            data: {
                name: data.name,
                description: data.description,
                color: data.color,
                routePath: data.routePath,
            },
        });

        return {
            success: true,
            message: "Ruta registrada correctamente.",
            route,
        };
    } catch (error) {
        console.error("ERROR COMPLETO AL CREAR RUTA:", error);

        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "No se pudo registrar la ruta.",
        };
    }
}

export async function deleteRoute(id: string) {
    try {
        const existingRoute = await prisma.route.findUnique({
            where: {
                id,
            },
        });

        if (!existingRoute) {
            return {
                success: false,
                message: "La ruta no existe.",
            };
        }

        await prisma.route.delete({
            where: {
                id,
            },
        });

        return {
            success: true,
            message: "Ruta eliminada correctamente.",
        };
    } catch (error) {
        console.error("ERROR AL ELIMINAR RUTA:", error);

        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "No se pudo eliminar la ruta.",
        };
    }
}