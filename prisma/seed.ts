import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ugrs",
    connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    const password = await bcrypt.hash("Admin123*", 10);

    const admin = await prisma.user.upsert({
        where: {
            email: "admin@ugrs.com",
        },
        update: {},
        create: {
            name: "Administrador",
            lastname: "Sistema",
            email: "admin@ugrs.com",
            password,
            role: "ADMIN",
            status: true,
        },
    });

    console.log("Administrador creado correctamente:");
    console.log(`Email: ${admin.email}`);
}

main()
    .catch((error) => {
        console.error("Error creando administrador:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });