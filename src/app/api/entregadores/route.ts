import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/permissions";
import type { Role } from "@/lib/permissions";

function getRole(req: NextRequest): Role {
  return (req.headers.get("x-user-role") ?? "ATENDENTE") as Role;
}

// GET /api/entregadores — list all delivery drivers
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const role = getRole(req);
  if (!can(role, "logistica:view")) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const entregadores = await prisma.entregador.findMany({
    where: status ? { status } : undefined,
    orderBy: { nome: "asc" },
  });

  return NextResponse.json({ entregadores });
}

// POST /api/entregadores — create delivery driver
export async function POST(req: NextRequest) {
  const role = getRole(req);
  if (!can(role, "logistica:manage")) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { nome, telefone, placa, veiculo } = await req.json();
  if (!nome) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  }

  const entregador = await prisma.entregador.create({
    data: { nome, telefone, placa, veiculo },
  });

  return NextResponse.json({ entregador }, { status: 201 });
}
