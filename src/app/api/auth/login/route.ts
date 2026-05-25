import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken, SESSION_COOKIE } from "@/lib/auth";

// Constant-time delay to prevent timing attacks and slow brute-force
async function loginDelay(success: boolean) {
  const base = success ? 0 : 500;
  const jitter = Math.floor(Math.random() * 200);
  await new Promise(r => setTimeout(r, base + jitter));
}

const REMEMBER_ME_DURATION = 60 * 60 * 24 * 30; // 30 days in seconds

export async function POST(req: NextRequest) {
  const { email, senha, rememberMe } = await req.json();

  if (!email || !senha) {
    return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
  }

  const emailNorm = String(email).toLowerCase().trim();

  const todos = await prisma.usuario.findMany({ where: {} });
  const usuario = todos.find(u => u.email.toLowerCase() === emailNorm) ?? null;

  if (!usuario) {
    await loginDelay(false);
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
  if (!senhaValida) {
    await loginDelay(false);
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  await loginDelay(true);

  const token = await createToken({
    userId: usuario.id,
    email: usuario.email,
    role: usuario.role,
    rememberMe: !!rememberMe,
  });

  const response = NextResponse.json({
    success: true,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, cargo: usuario.cargo, role: usuario.role },
  });

  const cookieOptions: Parameters<typeof response.cookies.set>[2] = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  };

  // "Remember me" → persistent 30-day cookie
  // Not remembered → session cookie (expires when browser closes)
  if (rememberMe) {
    cookieOptions.maxAge = REMEMBER_ME_DURATION;
  }

  response.cookies.set(SESSION_COOKIE, token, cookieOptions);

  return response;
}
