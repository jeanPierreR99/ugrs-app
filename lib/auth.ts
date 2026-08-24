import { jwtVerify, SignJWT, type JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export interface AuthPayload extends JWTPayload {
    userId: string;
    email: string;
    role: "ADMIN" | "CONDUCTOR" | "SISTEMA";
}

export async function createToken(payload: AuthPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
}

export async function verifyToken(token: string) {
    const { payload } = await jwtVerify(token, secret);

    return payload as unknown as AuthPayload;
}