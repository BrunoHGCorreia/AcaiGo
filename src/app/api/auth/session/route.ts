import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const usuario = await prisma.usuario.findUnique({
    where: { id: payload.userId },
    include: { preferencias: true },
    omit: { senhaHash: true },
  });

  if (!usuario) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

  return NextResponse.json({ usuario });
}
