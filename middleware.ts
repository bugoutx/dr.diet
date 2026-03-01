import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIES = [
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

function hasAuthCookie(req: NextRequest): boolean {
  return AUTH_COOKIES.some((name) => req.cookies.get(name)?.value);
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    if (hasAuthCookie(req)) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    if (!hasAuthCookie(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!hasAuthCookie(req)) {
      const loginUrl = new URL("/admin/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
