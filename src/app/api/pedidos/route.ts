import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pedidoSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: any = {};
  if (search) {
    where.OR = [
      { cliente: { nome: { contains: search, mode: "insensitive" } } },
      { id: isNaN(parseInt(search.replace("#", ""))) ? undefined : parseInt(search.replace("#", "")) },
    ].filter(Boolean);
  }
  if (status && status !== "Todos") where.status = status;

  const [pedidos, total] = await Promise.all([
    prisma.pedido.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        cliente: { select: { id: true, nome: true } },
        itens: { include: { produto: { select: { nome: true } } } },
      },
    }),
    prisma.pedido.count({ where }),
  ]);

  return NextResponse.json({ pedidos, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = pedidoSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const { clienteId, status, itens } = result.data;
  const total = itens.reduce((acc, item) => acc + item.precoUnit * item.quantidade, 0);

  const pedido = await prisma.pedido.create({
    data: {
      clienteId,
      status,
      total,
      itens: {
        create: itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnit: item.precoUnit,
        })),
      },
    },
    include: {
      cliente: { select: { nome: true } },
      itens: { include: { produto: { select: { nome: true } } } },
    },
  });

  return NextResponse.json(pedido, { status: 201 });
}
