export interface RoutePoint {
    lat: number;
    lng: number;
}

const EARTH_RADIUS = 6371000;

export const haversineDistance = (
    a: RoutePoint,
    b: RoutePoint
): number => {
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;

    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(dLng / 2) ** 2;

    return 2 * EARTH_RADIUS * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const projectPointToSegment = (
    point: RoutePoint,
    start: RoutePoint,
    end: RoutePoint
) => {
    const latFactor = 111320;
    const lngFactor =
        111320 * Math.cos((point.lat * Math.PI) / 180);

    const px = (point.lng - start.lng) * lngFactor;
    const py = (point.lat - start.lat) * latFactor;

    const sx = (end.lng - start.lng) * lngFactor;
    const sy = (end.lat - start.lat) * latFactor;

    const segmentLengthSquared = sx * sx + sy * sy;

    if (segmentLengthSquared === 0) {
        return {
            distance: haversineDistance(point, start),
            t: 0,
        };
    }

    let t = (px * sx + py * sy) / segmentLengthSquared;

    t = Math.max(0, Math.min(1, t));

    const projected: RoutePoint = {
        lat: start.lat + (end.lat - start.lat) * t,
        lng: start.lng + (end.lng - start.lng) * t,
    };

    return {
        distance: haversineDistance(point, projected),
        t,
    };
};

export const calculateRouteProgress = (
    position: RoutePoint,
    route: RoutePoint[]
) => {
    if (route.length < 2) {
        return {
            totalDistance: 0,
            traveledDistance: 0,
            remainingDistance: 0,
            progress: 0,
        };
    }

    const segmentDistances: number[] = [];
    let totalDistance = 0;

    for (let i = 0; i < route.length - 1; i++) {
        const distance = haversineDistance(route[i], route[i + 1]);
        segmentDistances.push(distance);
        totalDistance += distance;
    }

    let accumulatedDistance = 0;
    let bestDistance = Infinity;
    let traveledDistance = 0;

    for (let i = 0; i < route.length - 1; i++) {
        const start = route[i];
        const end = route[i + 1];

        const projection = projectPointToSegment(position, start, end);

        if (projection.distance < bestDistance) {
            bestDistance = projection.distance;

            traveledDistance =
                accumulatedDistance +
                segmentDistances[i] * projection.t;
        }

        accumulatedDistance += segmentDistances[i];
    }

    const remainingDistance = Math.max(
        0,
        totalDistance - traveledDistance
    );

    const progress =
        totalDistance > 0
            ? (traveledDistance / totalDistance) * 100
            : 0;

    return {
        totalDistance,
        traveledDistance,
        remainingDistance,
        progress,
    };
};