export interface LiveVehicle {
    id: string;
    code: string;
    plate: string;
    driver: string;
    route: string;
    status: "EN_RUTA" | "DETENIDO";
    speed: number;
    position: [number, number];
    routePath: {
        lat: number;
        lng: number;
    }[];
    updatedAt: number;
    color: string;
    heading: number;
    accuracy: number | null;
    appState: string | null;
}

export const latestPositions = new Map<string, LiveVehicle>();

export function setLiveVehicle(vehicle: LiveVehicle) {
    latestPositions.set(vehicle.id, vehicle);
}

export function getLiveVehicle(vehicleId: string) {
    return latestPositions.get(vehicleId);
}

export function getLiveVehicles() {
    return Array.from(latestPositions.values());
}

export function removeLiveVehicle(vehicleId: string) {
    latestPositions.delete(vehicleId);
}