import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "acaigo-crm-secret-key-2026-muito-seguro"
);

export const SESSION_COOKIE = "acaigo_session";
export const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

export async function createToken(payload: { userId: number; email: string; role: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: number; email: string; role: string };
  } catch {
    return null;
  }
}
