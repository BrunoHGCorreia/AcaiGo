import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/permissions";
import type { Role } from "@/lib/permissions";

function getRole(req: NextRequest): Role {
  return (req.headers.get("x-user-role") ?? "ATENDENTE") as Role;
}
function getUserId(req: NextRequest): number {
  return Number(req.headers.get("x-user-id") ?? 0);
}

// PUT /api/usuarios/[id] — update user (DONO only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = getRole(req);
  const callerId = getUserId(req);
  if (!can(role, "configuracoes:usuarios")) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const id = Number((await params).id);
  const { nome, email, cargo, roleNovo, novaSenha } = await req.json();

  // Prevent self-role downgrade
  if (callerId === id && roleNovo && roleNovo !== role) {
    return NextResponse.json({ error: "Você não pode alterar seu próprio nível de acesso" }, { status: 400 });
  }

  const updateData: any = {};
  if (nome) updateData.nome = nome;
  if (email) updateData.email = email;
  if (cargo) updateData.cargo = cargo;
  if (roleNovo) updateData.role = roleNovo;
  if (novaSenha) updateData.senhaHash = await bcrypt.hash(novaSenha, 12);

  try {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: updateData,
      omit: { senhaHash: true },
    });
    return NextResponse.json({ usuario });
  } catch {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }
}

// DELETE /api/usuarios/[id] — remove user (DONO only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = getRole(req);
  const callerId = getUserId(req);
  if (!can(role, "configuracoes:usuarios")) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const id = Number((await params).id);

  if (callerId === id) {
    return NextResponse.json({ error: "Você não pode remover sua própria conta" }, { status: 400 });
  }

  try {
    await prisma.usuario.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }
}
