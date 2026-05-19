import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pedidoStatusSchema } from "@/lib/validations";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pedido = await prisma.pedido.findUnique({
    where: { id: parseInt(id) },
    include: {
      cliente: true,
      itens: { include: { produto: true } },
    },
  });
  if (!pedido) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  return NextResponse.json(pedido);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const result = pedidoStatusSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const pedido = await prisma.pedido.update({
    where: { id: parseInt(id) },
    data: { status: result.data.status },
    include: { cliente: { select: { nome: true } } },
  });
  return NextResponse.json(pedido);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.pedido.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
