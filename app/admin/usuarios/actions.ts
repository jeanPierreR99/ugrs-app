"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { userSchema } from "./user.schema";

export async function createUser(data: unknown) {
    const validation = userSchema.safeParse(data);

    if (!validation.success) {
        return {
            success: false as const,
            message: "Los datos enviados no son válidos.",
        };
    }

    const { name, lastname, email, password, role } = validation.data;

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        return {
            success: false as const,
            message: "El correo electrónico ya está registrado.",
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            lastname,
            email,
            password: hashedPassword,
            role,
            status: true,
        },
        select: {
            id: true,
            name: true,
            lastname: true,
            email: true,
            role: true,
            status: true,
        },
    });

    return {
        success: true as const,
        message: "Usuario creado correctamente.",
        user,
    };
}