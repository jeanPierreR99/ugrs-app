import { z } from "zod";

export const userSchema = z.object({
    name: z.string().trim().min(1, "El nombre es obligatorio"),
    status: z.boolean(),
    lastname: z.string().trim().min(1, "Los apellidos son obligatorios"),
    email: z
        .string()
        .trim()
        .min(1, "El correo es obligatorio")
        .email("Ingresa un correo electrónico válido"),
    password: z
        .string()
        .refine(
            (value) => value === "" || value.length >= 8,
            "La contraseña debe tener al menos 8 caracteres"
        ),
    role: z.enum(["ADMIN", "CONDUCTOR", "SISTEMA"]),
});

export type UserFormData = z.infer<typeof userSchema>;