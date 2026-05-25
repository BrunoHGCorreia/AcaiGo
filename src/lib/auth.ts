import { SignJWT, jwtVerify } from "jose";

// In production, JWT_SECRET must be set as an environment variable.
// Generate a strong secret: openssl rand -base64 64
const rawSecret = process.env.JWT_SECRET ?? "acaigo-crm-secret-key-2026-muito-seguro-altere-em-producao";
const JWT_SECRET = new TextEncoder().encode(rawSecret);

const JWT_ISSUER = "acaigo-crm";
const JWT_AUDIENCE = "acaigo-users";

export const SESSION_COOKIE = "acaigo_session";
export const SESSION_DURATION = 60 * 60 * 24 * 30; // 30 days in seconds (used as max)

export async function createToken(payload: { userId: number; email: string; role: string; rememberMe?: boolean }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    // Try strict validation first (new tokens with issuer + audience)
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    return payload as { userId: number; email: string; role: string };
  } catch {
    // Fallback: accept older tokens that don't have issuer/audience claims
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return payload as { userId: number; email: string; role: string };
    } catch {
      return null;
    }
  }
}

