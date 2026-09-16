import { prisma } from "@/lib/prisma";
import RoutesLegendClient from "./RoutesLegendClient";

export const dynamic = "force-dynamic";
export default async function RoutesLegend() {
    const routes = await prisma.route.findMany({
        where: {
            active: true,
        },
        select: {
            id: true,
            name: true,
            description: true,
            color: true,
        },
        orderBy: {
            name: "asc",
        },
    });
    return (
        <>
            <RoutesLegendClient routes={routes} />
        </>
    );
}