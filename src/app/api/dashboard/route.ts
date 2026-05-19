import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const [
    pedidosHoje,
    faturamentoHoje,
    novosClientes,
    totalClientes,
    pedidosPorStatus,
    pedidosRecentes,
    faturamentoPorHora,
  ] = await Promise.all([
    // Pedidos hoje
    prisma.pedido.count({ where: { createdAt: { gte: hoje, lt: amanha } } }),

    // Faturamento hoje (apenas concluídos)
    prisma.pedido.aggregate({
      _sum: { total: true },
      where: { status: "Concluído", createdAt: { gte: hoje, lt: amanha } },
    }),

    // Novos clientes hoje
    prisma.cliente.count({ where: { createdAt: { gte: hoje, lt: amanha } } }),

    // Total de clientes
    prisma.cliente.count(),

    // Pedidos por status hoje
    prisma.pedido.groupBy({
      by: ["status"],
      _count: { id: true },
      where: { createdAt: { gte: hoje, lt: amanha } },
    }),

    // Pedidos recentes (últimos 5)
    prisma.pedido.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { cliente: { select: { nome: true } }, itens: { include: { produto: { select: { nome: true } } } } },
    }),

    // Faturamento por hora (últimas 9h)
    prisma.pedido.findMany({
      where: { status: "Concluído", createdAt: { gte: hoje, lt: amanha } },
      select: { createdAt: true, total: true },
    }),
  ]);

  // Aggregate faturamento por hora
  const horasMap: Record<string, number> = {};
  for (let h = 8; h <= 16; h++) {
    horasMap[`${h}h`] = 0;
  }
  for (const p of faturamentoPorHora) {
    const h = new Date(p.createdAt).getHours();
    const key = `${h}h`;
    if (horasMap[key] !== undefined) horasMap[key] += p.total;
  }
  const graficoHoras = Object.entries(horasMap).map(([hour, value]) => ({ hour, value }));

  // Status count map
  const statusMap: Record<string, number> = { Pedido: 0, Preparo: 0, Entrega: 0, Concluído: 0 };
  for (const s of pedidosPorStatus) {
    statusMap[s.status] = s._count.id;
  }

  return NextResponse.json({
    kpis: {
      faturamentoHoje: faturamentoHoje._sum.total || 0,
      pedidosHoje,
      novosClientes,
      totalClientes,
    },
    statusPedidos: statusMap,
    pedidosRecentes,
    graficoHoras,
  });
}
