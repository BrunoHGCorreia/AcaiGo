import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clienteSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: any = {};
  if (search) {
    where.OR = [
      { nome: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status && status !== "Todos") where.status = status;

  const [clientes, total] = await Promise.all([
    prisma.cliente.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { _count: { select: { pedidos: true } } },
    }),
    prisma.cliente.count({ where }),
  ]);

  return NextResponse.json({ clientes, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = clienteSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const existingEmail = await prisma.cliente.findUnique({ where: { email: result.data.email } });
  if (existingEmail) {
    return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
  }

  const cliente = await prisma.cliente.create({ data: result.data });
  return NextResponse.json(cliente, { status: 201 });
}
