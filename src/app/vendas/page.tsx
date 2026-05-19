"use client";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";

const dailyData = [
  { day: "Seg", vendas: 1820, pedidos: 48 }, { day: "Ter", vendas: 2340, pedidos: 62 },
  { day: "Qua", vendas: 1980, pedidos: 54 }, { day: "Qui", vendas: 2760, pedidos: 71 },
  { day: "Sex", vendas: 3100, pedidos: 85 }, { day: "Sáb", vendas: 3840, pedidos: 98 },
  { day: "Dom", vendas: 2200, pedidos: 58 },
];

const topProducts = [
  { name: "Açaí 500ml", vendas: 142, receita: "R$ 4.118,00", pct: 100 },
  { name: "Açaí 300ml", vendas: 98, receita: "R$ 1.960,00", pct: 69 },
  { name: "Açaí 700ml", vendas: 76, receita: "R$ 2.964,00", pct: 54 },
  { name: "Açaí 1L", vendas: 43, receita: "R$ 2.494,00", pct: 30 },
  { name: "Combo 2x500ml", vendas: 31, receita: "R$ 2.418,00", pct: 22 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-sm">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-semibold text-foreground">R$ {payload[0].value.toLocaleString("pt-BR")}</p>
    </div>
  );
  return null;
};

export default function Vendas() {
  const totalSemana = dailyData.reduce((s, d) => s + d.vendas, 0);
  const totalPedidos = dailyData.reduce((s, d) => s + d.pedidos, 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Vendas</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Relatório de vendas e desempenho</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Faturamento Semana", value: `R$ ${totalSemana.toLocaleString("pt-BR")}`, delta: "+18,4% vs semana anterior", positive: true, icon: DollarSign, color: "text-violet-500 bg-violet-500/10" },
          { label: "Pedidos Semana", value: totalPedidos, delta: "+12,1% vs semana anterior", positive: true, icon: ShoppingBag, color: "text-blue-500 bg-blue-500/10" },
          { label: "Ticket Médio", value: "R$ 31,52", delta: "-3,8% vs semana anterior", positive: false, icon: TrendingUp, color: "text-amber-500 bg-amber-500/10" },
          { label: "Novos Compradores", value: 24, delta: "+8 vs semana anterior", positive: true, icon: Users, color: "text-emerald-500 bg-emerald-500/10" },
        ].map((kpi, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className={`text-xs mt-1 flex items-center gap-1 ${kpi.positive ? "text-emerald-500" : "text-red-500"}`}>
              {kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {kpi.delta}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Faturamento Semanal</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Receita por dia da semana</p>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} dy={8} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `R$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="vendas" radius={[6, 6, 0, 0]}>
                  {dailyData.map((_, i) => (
                    <Cell key={i} fill={i === 5 ? "#7c3aed" : "hsl(var(--muted))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Top Produtos</h3>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-[12px] mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <span className="font-medium text-foreground">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-foreground">{p.vendas}</span>
                    <span className="text-muted-foreground ml-1">un.</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${p.pct}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{p.receita}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Vendas por Dia</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border">
                {["Dia", "Faturamento", "Pedidos", "Ticket Médio", "% vs Semana"].map(h => (
                  <th key={h} className="text-left py-3 px-5 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dailyData.map((d, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-foreground">{d.day}</td>
                  <td className="py-3.5 px-5 font-semibold text-foreground">R$ {d.vendas.toLocaleString("pt-BR")}</td>
                  <td className="py-3.5 px-5 text-foreground">{d.pedidos}</td>
                  <td className="py-3.5 px-5 text-muted-foreground">R$ {(d.vendas / d.pedidos).toFixed(2)}</td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((d.vendas / 3840) * 100)}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{Math.round((d.vendas / 3840) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
