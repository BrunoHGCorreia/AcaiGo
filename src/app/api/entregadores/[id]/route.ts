import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/permissions";
import type { Role } from "@/lib/permissions";

function getRole(req: NextRequest): Role {
  return (req.headers.get("x-user-role") ?? "ATENDENTE") as Role;
}

// GET /api/entregadores/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = getRole(req);
  if (!can(role, "logistica:view")) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }
  const { id } = await params;
  const entregador = await prisma.entregador.findUnique({
    where: { id: Number(id) },
    include: {
      despachos: {
        include: { pedido: { include: { cliente: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });
  if (!entregador) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json({ entregador });
}

// PUT /api/entregadores/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = getRole(req);
  const isMotoboy = role === "MOTOBOY";
  // Motoboy can only update status; managers can update all fields
  const canUpdate = isMotoboy
    ? can(role, "logistica:entregador_status")
    : can(role, "logistica:manage");
  if (!canUpdate) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const { id } = await params;
  const data = await req.json();
  const allowed = isMotoboy ? { status: data.status } : data;

  const entregador = await prisma.entregador.update({
    where: { id: Number(id) },
    data: allowed,
  });
  return NextResponse.json({ entregador });
}

// DELETE /api/entregadores/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = getRole(req);
  if (!can(role, "logistica:manage")) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.entregador.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
