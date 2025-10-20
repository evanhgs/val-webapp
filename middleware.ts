import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const url = req.nextUrl.clone();

    const isAuthPage = url.pathname.startsWith("/login") || url.pathname.startsWith("/register");
    const isProtectedPage = req.nextUrl.pathname.startsWith("/profile") ||
        req.nextUrl.pathname.startsWith("/upload") ||
        req.nextUrl.pathname.startsWith("/messages");


    if (!token && isProtectedPage) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    if (token && isAuthPage) {
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
