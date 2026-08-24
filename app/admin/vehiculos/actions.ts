"use server";

import { prisma } from "@/lib/prisma";
import { vehicleSchema, type VehicleFormData } from "./vehicle.schema";

export async function createVehicle(data: VehicleFormData) {
    const parsed = vehicleSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            message: "Los datos enviados no son válidos.",
        };
    }

    try {
        const { plate, driverIds, routeIds } = parsed.data;

        const existingVehicle = await prisma.vehicle.findUnique({
            where: {
                plate,
            },
        });

        if (existingVehicle) {
            return {
                success: false,
                message: "Ya existe un vehículo registrado con esa placa.",
            };
        }

        const vehicle = await prisma.vehicle.create({
            data: {
                plate,

                drivers: driverIds.length > 0
                    ? {
                        create: driverIds.map((driverId) => ({
                            driver: {
                                connect: {
                                    id: driverId,
                                },
                            },
                        })),
                    }
                    : undefined,

                routes: routeIds.length > 0
                    ? {
                        create: routeIds.map((routeId) => ({
                            route: {
                                connect: {
                                    id: routeId,
                                },
                            },
                        })),
                    }
                    : undefined,
            },

            include: {
                drivers: {
                    include: {
                        driver: {
                            select: {
                                id: true,
                                name: true,
                                lastname: true,
                            },
                        },
                    },
                },

                routes: {
                    include: {
                        route: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                color: true,
                            },
                        },
                    },
                },
            },
        });
        return {
            success: true,
            message: "Vehículo registrado correctamente.",
            vehicle,
        };
    } catch (error) {
        console.error("Error al crear vehículo:", error);

        return {
            success: false,
            message: "No se pudo registrar el vehículo.",
        };
    }
}

export async function updateVehicle(id: string, data: VehicleFormData) {
    const parsed = vehicleSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            message: "Los datos enviados no son válidos.",
        };
    }

    try {
        const { plate, driverIds, routeIds } = parsed.data;

        const existingVehicle = await prisma.vehicle.findUnique({
            where: {
                id,
            },
        });

        if (!existingVehicle) {
            return {
                success: false,
                message: "El vehículo no existe.",
            };
        }

        const vehicleWithSamePlate = await prisma.vehicle.findFirst({
            where: {
                plate,
                NOT: {
                    id,
                },
            },
        });

        if (vehicleWithSamePlate) {
            return {
                success: false,
                message: "Ya existe otro vehículo registrado con esa placa.",
            };
        }

        const vehicle = await prisma.vehicle.update({
            where: {
                id,
            },
            data: {
                plate,

                drivers: {
                    deleteMany: {},
                    ...(driverIds.length > 0
                        ? {
                            create: driverIds.map((driverId) => ({
                                driver: {
                                    connect: {
                                        id: driverId,
                                    },
                                },
                            })),
                        }
                        : {}),
                },

                routes: {
                    deleteMany: {},
                    ...(routeIds.length > 0
                        ? {
                            create: routeIds.map((routeId) => ({
                                route: {
                                    connect: {
                                        id: routeId,
                                    },
                                },
                            })),
                        }
                        : {}),
                },
            },

            include: {
                drivers: {
                    include: {
                        driver: {
                            select: {
                                id: true,
                                name: true,
                                lastname: true,
                            },
                        },
                    },
                },
                routes: {
                    include: {
                        route: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                color: true,
                            },
                        },
                    },
                },
            },
        });

        return {
            success: true,
            message: "Vehículo actualizado correctamente.",
            vehicle,
        };
    } catch (error) {
        console.error("Error al actualizar vehículo:", error);

        return {
            success: false,
            message: "No se pudo actualizar el vehículo.",
        };
    }
}