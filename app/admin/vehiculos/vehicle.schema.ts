import { z } from "zod";

export const vehicleSchema = z.object({
    id: z.string().optional(),
    plate: z
        .string()
        .min(1, "La placa es obligatoria")
        .max(10, "La placa no puede superar los 10 caracteres")
        .transform((value) => value.trim().toUpperCase()),

    driverIds: z.array(z.string()),
    routeIds: z.array(z.string()),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;