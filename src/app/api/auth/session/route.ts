import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  // No token = not logged in = demo mode (return null user, not an error)
  if (!token) return NextResponse.json({ usuario: null });

  const payload = await verifyToken(token);

  // Invalid token = treat as not logged in
  if (!payload) return NextResponse.json({ usuario: null });

  const usuario = await prisma.usuario.findUnique({
    where: { id: payload.userId },
    include: { preferencias: true },
    omit: { senhaHash: true },
  });

  // User deleted from DB = treat as not logged in
  if (!usuario) return NextResponse.json({ usuario: null });

  return NextResponse.json({ usuario });
}
