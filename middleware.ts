import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/config";

const AUTH_PATH = "/login";
const DASHBOARD_REDIRECT = "/claims";

function isPublicPath(pathname: string) {
  return pathname === AUTH_PATH || pathname.startsWith("/_next") || pathname.startsWith("/public") || pathname.startsWith("/favicon");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (isPublicPath(pathname) || pathname === "/") {
    if (pathname === AUTH_PATH) {
      const token = request.cookies.get(SESSION_COOKIE)?.value;
      if (token) {
        const url = request.nextUrl.clone();
        url.pathname = DASHBOARD_REDIRECT;
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = AUTH_PATH;
    if (pathname !== "/") {
      url.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
