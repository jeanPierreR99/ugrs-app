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

export async function updateUser(
    id: string,
    data: {
        name: string;
        lastname: string;
        email: string;
        password?: string;
        role: string;
        status: boolean
    }
) {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return {
                success: false,
                message: "El usuario no existe.",
            };
        }

        const emailExists = await prisma.user.findFirst({
            where: {
                email: data.email,
                NOT: {
                    id,
                },
            },
        });

        if (emailExists) {
            return {
                success: false,
                message: "El correo electrónico ya está registrado.",
            };
        }

        const updateData: any = {
            name: data.name,
            lastname: data.lastname,
            email: data.email,
            role: data.role,
            status: data.status
        };

        if (data.password?.trim()) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
        });

        return {
            success: true,
            message: "Usuario actualizado correctamente.",
            user: {
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
                status: user.status,
            },
        };
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "No se pudo actualizar el usuario.",
        };
    }
}