import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken, SESSION_COOKIE, SESSION_DURATION } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, senha } = await req.json();

  if (!email || !senha) {
    return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
  }

  // Normalize: busca todos os usuários com email correspondente ignorando case
  // SQLite não tem suporte nativo a case-insensitive no Prisma, então buscamos
  // todos e comparamos em JS
  const emailNorm = String(email).toLowerCase().trim();

  const todos = await prisma.usuario.findMany({
    where: {},
  });

  const usuario = todos.find(u => u.email.toLowerCase() === emailNorm) ?? null;

  if (!usuario) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
  if (!senhaValida) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  const token = await createToken({ userId: usuario.id, email: usuario.email, role: usuario.role });

  const response = NextResponse.json({
    success: true,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, cargo: usuario.cargo, role: usuario.role },
  });

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });

  return response;
}
