"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react";

const fluxo = [
  { mes: "Jan", receita: 18200, despesa: 6800 }, { mes: "Fev", receita: 21400, despesa: 7200 },
  { mes: "Mar", receita: 19800, despesa: 8100 }, { mes: "Abr", receita: 24600, despesa: 7500 },
  { mes: "Mai", receita: 28300, despesa: 9200 },
];

const transacoes = [
  { desc: "Venda de Açaí — João Silva", tipo: "Entrada", valor: "R$ 58,90", data: "Hoje, 14:32", cat: "Vendas" },
  { desc: "Fornecedor Polpa de Açaí", tipo: "Saída", valor: "R$ 380,00", data: "Hoje, 10:00", cat: "Insumos" },
  { desc: "Venda de Açaí — Maria Oliveira", tipo: "Entrada", valor: "R$ 42,50", data: "Hoje, 14:12", cat: "Vendas" },
  { desc: "Aluguel do Estabelecimento", tipo: "Saída", valor: "R$ 1.200,00", data: "Hoje, 09:00", cat: "Fixos" },
  { desc: "Venda de Açaí — Carlos Santos", tipo: "Entrada", valor: "R$ 37,90", data: "Hoje, 13:45", cat: "Vendas" },
  { desc: "Embalagens e Copos", tipo: "Saída", valor: "R$ 145,00", data: "Ontem", cat: "Insumos" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-xs">
      <p className="text-muted-foreground mb-1.5 font-semibold">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name === "receita" ? "Receita" : "Despesa"}: R$ {p.value.toLocaleString("pt-BR")}
        </p>
      ))}
    </div>
  );
  return null;
};

export default function Financeiro() {
  const receita = fluxo[fluxo.length - 1].receita;
  const despesa = fluxo[fluxo.length - 1].despesa;
  const lucro = receita - despesa;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Fluxo de caixa e transações</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Receita (Mai)</p>
          <p className="text-3xl font-bold text-foreground mt-2">R$ {receita.toLocaleString("pt-BR")}</p>
          <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1.5"><ArrowUpRight className="w-3 h-3" />+15,1% vs abril</p>
          <div className="mt-3 h-1.5 rounded-full bg-emerald-500/20"><div className="h-full rounded-full bg-emerald-500 w-[72%]" /></div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Despesas (Mai)</p>
          <p className="text-3xl font-bold text-foreground mt-2">R$ {despesa.toLocaleString("pt-BR")}</p>
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1.5"><ArrowDownRight className="w-3 h-3" />+22,7% vs abril</p>
          <div className="mt-3 h-1.5 rounded-full bg-red-500/20"><div className="h-full rounded-full bg-red-500 w-[32%]" /></div>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
          <p className="text-sm text-muted-foreground">Lucro Líquido (Mai)</p>
          <p className="text-3xl font-bold text-emerald-500 mt-2">R$ {lucro.toLocaleString("pt-BR")}</p>
          <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1.5"><TrendingUp className="w-3 h-3" />Margem de {Math.round((lucro/receita)*100)}%</p>
          <div className="mt-3 h-1.5 rounded-full bg-emerald-500/20"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.round((lucro/receita)*100)}%` }} /></div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Fluxo de Caixa — 5 meses</h3>
        <p className="text-xs text-muted-foreground mb-4">Receitas vs Despesas</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fluxo} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gDes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} dy={8} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `R$${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2} fill="url(#gRec)" dot={false} />
              <Area type="monotone" dataKey="despesa" stroke="#ef4444" strokeWidth={2} fill="url(#gDes)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-6 mt-3">
          <div className="flex items-center gap-2"><div className="w-3 h-1.5 rounded-full bg-emerald-500" /><span className="text-xs text-muted-foreground">Receita</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-1.5 rounded-full bg-red-500" /><span className="text-xs text-muted-foreground">Despesa</span></div>
        </div>
      </div>

      {/* Transactions */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Últimas Transações</h3>
        </div>
        <div className="divide-y divide-border">
          {transacoes.map((t, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.tipo === "Entrada" ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                  {t.tipo === "Entrada" ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-foreground">{t.desc}</p>
                  <p className="text-[11px] text-muted-foreground">{t.data} · {t.cat}</p>
                </div>
              </div>
              <span className={`text-[13px] font-bold ${t.tipo === "Entrada" ? "text-emerald-500" : "text-red-500"}`}>
                {t.tipo === "Entrada" ? "+" : "-"}{t.valor}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
