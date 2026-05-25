"use client";
import useSWR from "swr";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-xs">
      <p className="text-muted-foreground mb-1.5 font-semibold">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name === "receita" ? "Receita" : "Despesa Estimada"}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
  return null;
};

export default function Financeiro() {
  const { data, isLoading } = useSWR("/api/financeiro", fetcher, { refreshInterval: 30000 });

  const fluxo = data?.fluxo ?? [];
  const transacoes = data?.transacoes ?? [];
  const receita = data?.kpis?.receita ?? 0;
  const despesa = data?.kpis?.despesa ?? 0;
  const lucro = data?.kpis?.lucro ?? 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Fluxo de caixa e transações do mês atual</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Receita (Mês Atual)</p>
          <p className="text-3xl font-bold text-foreground mt-2">{formatCurrency(receita)}</p>
          <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1.5">
            <ArrowUpRight className="w-3 h-3" /> Pedidos concluídos
          </p>
          <div className="mt-3 h-1.5 rounded-full bg-emerald-500/20">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: receita > 0 ? "100%" : "0%" }} />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Despesas Estimadas</p>
          <p className="text-3xl font-bold text-foreground mt-2">{formatCurrency(despesa)}</p>
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1.5">
            <ArrowDownRight className="w-3 h-3" /> ~35% da receita
          </p>
          <div className="mt-3 h-1.5 rounded-full bg-red-500/20">
            <div className="h-full rounded-full bg-red-500" style={{ width: receita > 0 ? `${Math.round((despesa / receita) * 100)}%` : "0%" }} />
          </div>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
          <p className="text-sm text-muted-foreground">Lucro Líquido</p>
          <p className="text-3xl font-bold text-emerald-500 mt-2">{formatCurrency(lucro)}</p>
          <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1.5">
            <TrendingUp className="w-3 h-3" />
            Margem de {receita > 0 ? Math.round((lucro / receita) * 100) : 0}%
          </p>
          <div className="mt-3 h-1.5 rounded-full bg-emerald-500/20">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: receita > 0 ? `${Math.round((lucro / receita) * 100)}%` : "0%" }} />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Fluxo de Caixa — Últimos 6 meses</h3>
        <p className="text-xs text-muted-foreground mb-4">Receitas vs Despesas Estimadas</p>
        {fluxo.length === 0 ? (
          <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
            Nenhum dado financeiro disponível ainda
          </div>
        ) : (
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
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `R$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2} fill="url(#gRec)" dot={false} />
                <Area type="monotone" dataKey="despesa" stroke="#ef4444" strokeWidth={2} fill="url(#gDes)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="flex items-center gap-6 mt-3">
          <div className="flex items-center gap-2"><div className="w-3 h-1.5 rounded-full bg-emerald-500" /><span className="text-xs text-muted-foreground">Receita</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-1.5 rounded-full bg-red-500" /><span className="text-xs text-muted-foreground">Despesa Estimada</span></div>
        </div>
      </div>

      {/* Transactions */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Últimas Transações</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Pedidos concluídos recentes</p>
          </div>
          <span className="text-xs text-muted-foreground">{transacoes.length} transações</span>
        </div>
        <div className="divide-y divide-border">
          {transacoes.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Nenhuma transação encontrada
            </div>
          ) : (
            transacoes.map((t: any, i: number) => (
              <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{t.desc}</p>
                    <p className="text-[11px] text-muted-foreground">{t.data} · {t.cat}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[13px] font-bold text-emerald-500">+{t.valor}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{t.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
