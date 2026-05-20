import { SignJWT, jwtVerify } from "jose";

// In production, JWT_SECRET must be set as an environment variable.
// Generate a strong secret: openssl rand -base64 64
const rawSecret = process.env.JWT_SECRET ?? "acaigo-crm-secret-key-2026-muito-seguro-altere-em-producao";
const JWT_SECRET = new TextEncoder().encode(rawSecret);

const JWT_ISSUER = "acaigo-crm";
const JWT_AUDIENCE = "acaigo-users";

export const SESSION_COOKIE = "acaigo_session";
export const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

export async function createToken(payload: { userId: number; email: string; role: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    return payload as { userId: number; email: string; role: string };
  } catch {
    return null;
  }
}

