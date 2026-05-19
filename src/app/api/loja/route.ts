import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

async function getUsuarioId(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload?.userId || null;
}

// GET — load loja
export async function GET() {
  const loja = await prisma.loja.findFirst();
  return NextResponse.json({ loja: loja || {} });
}

// PUT — save loja
export async function PUT(req: NextRequest) {
  const id = await getUsuarioId(req);
  if (!id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json();
  const { nome, cnpj, endereco, bairro, cidade, cep, horarioAbre, horarioFecha } = body;

  let loja = await prisma.loja.findFirst();
  if (loja) {
    loja = await prisma.loja.update({
      where: { id: loja.id },
      data: { nome, cnpj, endereco, bairro, cidade, cep, horarioAbre, horarioFecha },
    });
  } else {
    loja = await prisma.loja.create({
      data: { nome, cnpj, endereco, bairro, cidade, cep, horarioAbre, horarioFecha },
    });
  }

  return NextResponse.json({ loja });
}
