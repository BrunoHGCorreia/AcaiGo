import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { produtoSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const categoria = searchParams.get("categoria") || "";
  const status = searchParams.get("status") || "";

  const where: any = {};
  if (search) where.nome = { contains: search, mode: "insensitive" };
  if (categoria && categoria !== "Todos") where.categoria = categoria;
  if (status && status !== "Todos") where.status = status;

  const produtos = await prisma.produto.findMany({
    where,
    orderBy: { nome: "asc" },
  });

  return NextResponse.json({ produtos });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = produtoSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  // Auto-set status based on estoque
  let status = result.data.status;
  if (result.data.estoque === 0) status = "Esgotado";
  else if (result.data.estoque < 15) status = "Baixo";
  else status = "Ativo";

  const produto = await prisma.produto.create({ data: { ...result.data, status } });
  return NextResponse.json(produto, { status: 201 });
}
