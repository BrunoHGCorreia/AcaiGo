import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/permissions";
import type { Role } from "@/lib/permissions";

function getRole(req: NextRequest): Role {
  return (req.headers.get("x-user-role") ?? "ATENDENTE") as Role;
}

// GET /api/despachos — list dispatches (with filters)
export async function GET(req: NextRequest) {
  const role = getRole(req);
  if (!can(role, "logistica:view")) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const entregadorId = searchParams.get("entregadorId");

  const despachos = await prisma.despacho.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(entregadorId ? { entregadorId: Number(entregadorId) } : {}),
    },
    include: {
      pedido: { include: { cliente: true } },
      entregador: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ despachos });
}

// POST /api/despachos — dispatch a pedido to a driver
export async function POST(req: NextRequest) {
  const role = getRole(req);
  if (!can(role, "logistica:dispatch")) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const userId = Number(req.headers.get("x-user-id"));
  const { pedidoId, entregadorId, taxaEntrega } = await req.json();

  if (!pedidoId || !entregadorId) {
    return NextResponse.json({ error: "pedidoId e entregadorId são obrigatórios" }, { status: 400 });
  }

  // Create dispatch and update pedido status and entregador status atomically
  const [despacho] = await prisma.$transaction([
    prisma.despacho.create({
      data: {
        pedidoId: Number(pedidoId),
        entregadorId: Number(entregadorId),
        despachadorId: userId || undefined,
        taxaEntrega: Number(taxaEntrega ?? 0),
        status: "Em Rota",
      },
      include: {
        pedido: { include: { cliente: true } },
        entregador: true,
      },
    }),
    prisma.pedido.update({
      where: { id: Number(pedidoId) },
      data: { status: "Saiu para Entrega" },
    }),
    prisma.entregador.update({
      where: { id: Number(entregadorId) },
      data: { status: "Em Rota" },
    }),
  ]);

  return NextResponse.json({ despacho }, { status: 201 });
}
