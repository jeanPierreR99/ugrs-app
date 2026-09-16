import type { Server } from "socket.io";

declare global {
    // eslint-disable-next-line no-var
    var __UGRS_SOCKET_IO__: Server | undefined;
}

export function setIO(server: Server) {
    globalThis.__UGRS_SOCKET_IO__ = server;

    console.log("✅ Socket.IO registrado correctamente");
}

export function getIO(): Server | null {
    if (!globalThis.__UGRS_SOCKET_IO__) {
        console.log("❌ Socket.IO NO está disponible.");
        return null;
    }

    return globalThis.__UGRS_SOCKET_IO__;
}

export function registerSocketHandlers(server: Server) {
    setIO(server);

    server.on("connection", (socket) => {
        console.log("🔌 Cliente conectado:", socket.id);

        socket.on("disconnect", (reason) => {
            console.log(
                "🔌 Cliente desconectado:",
                socket.id,
                "Motivo:",
                reason
            );
        });
    });
}