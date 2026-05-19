import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

async function getUsuarioId(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload?.userId || null;
}

// GET — load profile + preferences
export async function GET(req: NextRequest) {
  const id = await getUsuarioId(req);
  if (!id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const usuario = await prisma.usuario.findUnique({
    where: { id },
    include: { preferencias: true },
    omit: { senhaHash: true },
  });

  return NextResponse.json({ usuario });
}

// PUT — update profile fields
export async function PUT(req: NextRequest) {
  const id = await getUsuarioId(req);
  if (!id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json();
  const { nome, email, telefone, cargo, senhaAtual, novaSenha } = body;

  // If changing password
  if (novaSenha) {
    if (!senhaAtual) return NextResponse.json({ error: "Senha atual é obrigatória" }, { status: 400 });
    if (novaSenha.length < 8) return NextResponse.json({ error: "A nova senha deve ter ao menos 8 caracteres" }, { status: 400 });

    const usuario = await prisma.usuario.findUnique({ where: { id } });
    if (!usuario) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senhaHash);
    if (!senhaValida) return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 });

    const senhaHash = await bcrypt.hash(novaSenha, 12);
    await prisma.usuario.update({ where: { id }, data: { senhaHash } });
    return NextResponse.json({ success: true, message: "Senha alterada com sucesso" });
  }

  // Update profile fields
  const data: any = {};
  if (nome) data.nome = nome;
  if (email) data.email = email;
  if (telefone !== undefined) data.telefone = telefone;
  if (cargo) data.cargo = cargo;

  const updated = await prisma.usuario.update({
    where: { id },
    data,
    omit: { senhaHash: true },
  });

  return NextResponse.json({ usuario: updated });
}
