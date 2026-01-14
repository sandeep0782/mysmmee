// middleware.js
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// List of routes to protect
const protectedRoutes = ["/admin", "/user"];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const tokenCookie = req.cookies.get("access_token"); // returns RequestCookie

    // No token → redirect to login
    if (!tokenCookie) {
      const loginUrl = new URL("/auth/login", req.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }

    const token = tokenCookie.value; // <-- access the string value

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
      const role = payload.role;
      console.log(role);

      // Redirect if role doesn't match the route
      if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(
          new URL("/user/dashboard", req.nextUrl.origin)
        );
      }

      if (pathname.startsWith("/user") && role !== "user") {
        return NextResponse.redirect(
          new URL("/admin/dashboard", req.nextUrl.origin)
        );
      }
    } catch (error) {
      console.log("Invalid JWT in middleware:", error);
      return NextResponse.redirect(new URL("/auth/login", req.nextUrl.origin));
    }
  }

  return NextResponse.next();
}

// Only run middleware on admin and user routes
export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
