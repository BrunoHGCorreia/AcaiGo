import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clienteSchema } from "@/lib/validations";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cliente = await prisma.cliente.findUnique({
    where: { id: parseInt(id) },
    include: {
      pedidos: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { itens: { include: { produto: { select: { nome: true } } } } },
      },
    },
  });
  if (!cliente) return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
  return NextResponse.json(cliente);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const result = clienteSchema.partial().safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const cliente = await prisma.cliente.update({
    where: { id: parseInt(id) },
    data: result.data,
  });
  return NextResponse.json(cliente);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.cliente.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
