import { auth } from "@/lib/auth";

export default auth((req) => {
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isApiAdmin = req.nextUrl.pathname.startsWith("/api/admin");

  // API admin routes: return 401 if not authenticated
  if (isApiAdmin && !req.auth) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Admin pages: redirect to login if not authenticated
  if (isAdminPage && !isLoginPage && !req.auth) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  // Redirect logged-in users away from login
  if (isLoginPage && req.auth) {
    return Response.redirect(new URL("/admin", req.nextUrl.origin));
  }

  return undefined;
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
