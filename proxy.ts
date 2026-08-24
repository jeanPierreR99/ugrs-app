import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(request: NextRequest) {
    const token = request.cookies.get("ugrs_token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const { payload } = await jwtVerify(token, secret);

        if (!payload.role) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        return NextResponse.next();
    } catch {
        const response = NextResponse.redirect(
            new URL("/login", request.url)
        );

        response.cookies.delete("ugrs_token");

        return response;
    }
}

export const config = {
    matcher: ["/admin/:path*"],
};