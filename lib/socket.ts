import type { Server } from "socket.io";
import { prisma } from "@/lib/prisma";

export function registerSocketHandlers(io: Server) {
    io.on("connection", (socket) => {
        console.log("Cliente conectado:", socket.id);

        socket.on("location:update", async (data: any) => {
            console.log(data)
            // try {
            //     console.log("📍 Nueva ubicación:", {
            //         userId,
            //         vehicleId,
            //         routeId,
            //         coors
            //     });

            //     const vehicleRoute = await prisma.vehicleRoute.findFirst({
            //         where: {
            //             vehicleId,
            //             routeId,
            //         },
            //     });

            //     if (!vehicleRoute) {
            //         socket.emit("location:error", {
            //             message: "El vehículo no pertenece a esta ruta.",
            //         });

            //         return;
            //     }

            //     await prisma.vehicle.update({
            //         where: {
            //             id: vehicleId,
            //         },
            //         data: {
            //             position: `${coors}`,
            //         },
            //     });

            //     io.emit("vehicle:position", {
            //         vehicleId,
            //         routeId,
            //         position: coors,
            //         timestamp: Date.now(),
            //     });
            // } catch (error) {
            //     console.error("Error actualizando ubicación:", error);

            //     socket.emit("location:error", {
            //         message: "No se pudo actualizar la ubicación.",
            //     });
            // }
        });

        socket.on("disconnect", (reason) => {
            console.log("Cliente desconectado:", socket.id, "Motivo:", reason);
        });
    });
}