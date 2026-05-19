import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { produtoSchema } from "@/lib/validations";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const produto = await prisma.produto.findUnique({ where: { id: parseInt(id) } });
  if (!produto) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  return NextResponse.json(produto);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const result = produtoSchema.partial().safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const data = { ...result.data };
  if (data.estoque !== undefined) {
    if (data.estoque === 0) data.status = "Esgotado";
    else if (data.estoque < 15) data.status = "Baixo";
    else if (!data.status) data.status = "Ativo";
  }

  const produto = await prisma.produto.update({ where: { id: parseInt(id) }, data });
  return NextResponse.json(produto);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.produto.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
