import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

interface Params {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    _request: NextRequest,
    { params }: Params
) {
    try {
        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                lastname: true,
                email: true,
                role: true,
                status: true,
                vehicles: {
                    select: {
                        id: true,
                        plate: true,
                        route: true,
                        status: true,
                        color: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error obteniendo usuario:", error);

        return NextResponse.json(
            { message: "Error al obtener el usuario" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: Params
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const {
            name,
            lastname,
            email,
            password,
            role,
            status,
        } = body;

        const existingUser = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!existingUser) {
            return NextResponse.json(
                { message: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        if (email && email !== existingUser.email) {
            const emailExists = await prisma.user.findUnique({
                where: {
                    email,
                },
            });

            if (emailExists) {
                return NextResponse.json(
                    { message: "El correo electrónico ya está registrado" },
                    { status: 409 }
                );
            }
        }

        const data: {
            name?: string;
            lastname?: string;
            email?: string;
            password?: string;
            role?: "ADMIN" | "CONDUCTOR";
            status?: boolean;
        } = {};

        if (name !== undefined) data.name = name;
        if (lastname !== undefined) data.lastname = lastname;
        if (email !== undefined) data.email = email;
        if (role !== undefined) data.role = role;
        if (status !== undefined) data.status = status;

        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: {
                id,
            },
            data,
            select: {
                id: true,
                name: true,
                lastname: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error actualizando usuario:", error);

        return NextResponse.json(
            { message: "Error al actualizar el usuario" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: Params
) {
    try {
        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                vehicles: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        if (user.vehicles.length > 0) {
            return NextResponse.json(
                {
                    message:
                        "No se puede eliminar el usuario porque tiene vehículos asignados",
                },
                { status: 400 }
            );
        }

        await prisma.user.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({
            message: "Usuario eliminado correctamente",
        });
    } catch (error) {
        console.error("Error eliminando usuario:", error);

        return NextResponse.json(
            { message: "Error al eliminar el usuario" },
            { status: 500 }
        );
    }
}