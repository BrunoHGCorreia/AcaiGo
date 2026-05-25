import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const agora = new Date();

  // Last 6 months range
  const meses: { mes: string; inicio: Date; fim: Date }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
    const fim = new Date(agora.getFullYear(), agora.getMonth() - i + 1, 1);
    meses.push({
      mes: d.toLocaleString("pt-BR", { month: "short" }).replace(".", ""),
      inicio: d,
      fim,
    });
  }

  // Revenue per month from completed orders
  const fluxoPromises = meses.map(async (m) => {
    const result = await prisma.pedido.aggregate({
      _sum: { total: true },
      where: {
        status: "Concluído",
        createdAt: { gte: m.inicio, lt: m.fim },
      },
    });
    return {
      mes: m.mes.charAt(0).toUpperCase() + m.mes.slice(1),
      receita: result._sum.total || 0,
      // Despesas estimadas como 35% da receita (sem modelo de despesas no banco)
      despesa: Math.round((result._sum.total || 0) * 0.35),
    };
  });

  const fluxo = await Promise.all(fluxoPromises);

  // Last 10 pedidos as transactions
  const pedidosRecentes = await prisma.pedido.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { cliente: { select: { nome: true } } },
  });

  const transacoes = pedidosRecentes.map((p) => ({
    desc: `Venda — ${p.cliente.nome}`,
    tipo: "Entrada" as const,
    valor: p.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    valorNum: p.total,
    data: new Date(p.createdAt).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
    }),
    cat: "Vendas",
    status: p.status,
  }));

  // KPIs do mês atual
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const [receitaMes, pedidosMes] = await Promise.all([
    prisma.pedido.aggregate({
      _sum: { total: true },
      where: { status: "Concluído", createdAt: { gte: inicioMes } },
    }),
    prisma.pedido.count({ where: { createdAt: { gte: inicioMes } } }),
  ]);

  const receitaTotal = receitaMes._sum.total || 0;
  const despesaEstimada = Math.round(receitaTotal * 0.35);
  const lucro = receitaTotal - despesaEstimada;

  return NextResponse.json({
    kpis: { receita: receitaTotal, despesa: despesaEstimada, lucro, pedidosMes },
    fluxo,
    transacoes,
  });
}
