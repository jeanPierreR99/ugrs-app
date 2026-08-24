import { z } from "zod";

export const userSchema = z.object({
    name: z.string().trim().min(1, "El nombre es obligatorio"),
    lastname: z.string().trim().min(1, "Los apellidos son obligatorios"),
    email: z
        .string()
        .trim()
        .min(1, "El correo es obligatorio")
        .email("Ingresa un correo electrónico válido"),
    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres"),
    role: z.enum(["ADMIN", "CONDUCTOR"]),
});

export type UserFormData = z.infer<typeof userSchema>;