import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
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
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Error obteniendo usuarios:", error);

        return NextResponse.json(
            { message: "Error al obtener los usuarios" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            name,
            lastname,
            email,
            password,
            role = "CONDUCTOR",
            status = true,
        } = body;

        if (!name || !lastname || !email || !password) {
            return NextResponse.json(
                {
                    message: "Nombre, apellido, email y contraseña son obligatorios",
                },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    message: "El correo electrónico ya está registrado",
                },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                lastname,
                email,
                password: hashedPassword,
                role,
                status,
            },
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

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error("Error creando usuario:", error);

        return NextResponse.json(
            { message: "Error al crear el usuario" },
            { status: 500 }
        );
    }
}