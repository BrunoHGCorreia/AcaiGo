import { NextRequest, NextResponse } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

// Public routes that don't require authentication
const PUBLIC_PATHS = ["/login"];

// Semi-public routes: accessible without login (page handles demo mode)
// These routes show demo data when not logged in
const DEMO_PUBLIC_PATHS = [
  "/",
  "/clientes",
  "/pedidos",
  "/produtos",
  "/financeiro",
  "/leads",
  "/logistica",
  "/entrega",
  "/relatorios",
  "/graficos",
  "/desempenho",
  "/vendas",
  "/configuracoes",
];

// Security headers applied to every response
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes — redirect logged-in users to dashboard
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return addSecurityHeaders(NextResponse.redirect(new URL("/", request.url)));
      }
    }
    return addSecurityHeaders(NextResponse.next());
  }

  // Allow API auth routes always
  if (pathname.startsWith("/api/auth")) {
    return addSecurityHeaders(NextResponse.next());
  }

  // Check if this is a demo-public page route
  const isDemoPublic = DEMO_PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const payload = token ? await verifyToken(token) : null;

  // For demo-public pages: allow access without login (page shows demo mode)
  if (isDemoPublic) {
    if (payload) {
      // Inject user headers for logged-in users
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", String(payload.userId));
      requestHeaders.set("x-user-email", payload.email);
      if (payload.role) requestHeaders.set("x-user-role", payload.role as string);
      return addSecurityHeaders(NextResponse.next({ request: { headers: requestHeaders } }));
    }
    // Not logged in: allow through (page handles demo mode)
    return addSecurityHeaders(NextResponse.next());
  }

  // All other routes (API, etc.) require authentication
  if (!token || !payload) {
    if (!pathname.startsWith("/api/")) {
      return addSecurityHeaders(NextResponse.redirect(new URL("/login", request.url)));
    }
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  // Inject user info into request headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", String(payload.userId));
  requestHeaders.set("x-user-email", payload.email);
  if (payload.role) requestHeaders.set("x-user-role", payload.role as string);

  return addSecurityHeaders(NextResponse.next({ request: { headers: requestHeaders } }));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
