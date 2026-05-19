import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

async function getUsuarioId(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload?.userId || null;
}

// PUT — save preferences (theme + notifications)
export async function PUT(req: NextRequest) {
  const id = await getUsuarioId(req);
  if (!id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json();
  const { tema, notifPedidos, notifFinanceiro, notifLeads, notifSistema } = body;

  const preferencias = await prisma.preferencias.upsert({
    where: { usuarioId: id },
    update: { tema, notifPedidos, notifFinanceiro, notifLeads, notifSistema },
    create: { usuarioId: id, tema, notifPedidos, notifFinanceiro, notifLeads, notifSistema },
  });

  return NextResponse.json({ preferencias });
}
