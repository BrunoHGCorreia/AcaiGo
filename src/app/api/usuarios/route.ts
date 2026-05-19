import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/permissions";
import type { Role } from "@/lib/permissions";
import { createToken, SESSION_COOKIE, SESSION_DURATION } from "@/lib/auth";

function getRole(req: NextRequest): Role {
  return (req.headers.get("x-user-role") ?? "ATENDENTE") as Role;
}

// GET /api/usuarios — list team members (DONO only)
export async function GET(req: NextRequest) {
  const role = getRole(req);
  if (!can(role, "configuracoes:usuarios")) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const usuarios = await prisma.usuario.findMany({
    omit: { senhaHash: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ usuarios });
}

// POST /api/usuarios — create a new team member (DONO only)
export async function POST(req: NextRequest) {
  const role = getRole(req);
  if (!can(role, "configuracoes:usuarios")) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { nome, email, senha, cargo, roleNovo } = await req.json();
  if (!nome || !email || !senha) {
    return NextResponse.json({ error: "Nome, email e senha são obrigatórios" }, { status: 400 });
  }

  const existing = await prisma.usuario.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
  }

  const senhaHash = await bcrypt.hash(senha, 12);
  const usuario = await prisma.usuario.create({
    data: {
      nome,
      email,
      senhaHash,
      cargo: cargo ?? "Atendente",
      role: roleNovo ?? "ATENDENTE",
      preferencias: { create: { tema: "dark" } },
    },
    omit: { senhaHash: true },
  });

  return NextResponse.json({ usuario }, { status: 201 });
}
