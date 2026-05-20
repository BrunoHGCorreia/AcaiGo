import { NextRequest, NextResponse } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

// Public routes that don't require authentication
const PUBLIC_PATHS = ["/login"];

// Security headers applied to every response
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes — but redirect to dashboard if already logged in
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

  // Allow API auth routes
  if (pathname.startsWith("/api/auth")) {
    return addSecurityHeaders(NextResponse.next());
  }

  // Check session cookie
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    // Redirect to login for page requests
    if (!pathname.startsWith("/api/")) {
      return addSecurityHeaders(NextResponse.redirect(new URL("/login", request.url)));
    }
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    // Invalid token
    if (!pathname.startsWith("/api/")) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete(SESSION_COOKIE);
      return addSecurityHeaders(response);
    }
    return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });
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

