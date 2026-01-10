// middleware.js
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// List of routes to protect
const protectedRoutes = ["/admin", "/user"];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if the requested path starts with any protected route
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = req.cookies.get("access_token"); // assuming JWT or session stored in cookies

    if (!token) {
      // Redirect to login page if not authenticated
      const loginUrl = new URL("/auth/login", req.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Continue if not a protected route or user is authenticated
  return NextResponse.next();
}

// Middleware runs only on /admin and /user routes
export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
