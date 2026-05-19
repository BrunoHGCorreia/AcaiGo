"use client";
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, Target, Award, Clock, Star } from "lucide-react";

const metas = [
  { label: "Faturamento Mensal", meta: "R$ 30.000", atual: "R$ 28.300", pct: 94, color: "#7c3aed" },
  { label: "Pedidos no Mês", meta: "500", atual: "476", pct: 95, color: "#10b981" },
  { label: "Novos Clientes", meta: "30", atual: "24", pct: 80, color: "#3b82f6" },
  { label: "Taxa de Retenção", meta: "75%", atual: "68%", pct: 91, color: "#f59e0b" },
];

const kpiSemana = [
  { dia: "Seg", pedidos: 48, meta: 50 }, { dia: "Ter", pedidos: 62, meta: 50 },
  { dia: "Qua", pedidos: 54, meta: 50 }, { dia: "Qui", pedidos: 71, meta: 50 },
  { dia: "Sex", pedidos: 85, meta: 50 }, { dia: "Sáb", pedidos: 98, meta: 50 },
  { dia: "Dom", pedidos: 58, meta: 50 },
];

const destaques = [
  { icon: Award, title: "Melhor dia da semana", value: "Sábado — 98 pedidos", color: "text-amber-500 bg-amber-500/10" },
  { icon: Star, title: "Produto destaque", value: "Açaí 500ml — 142 un.", color: "text-violet-500 bg-violet-500/10" },
  { icon: Clock, title: "Horário de pico", value: "19h–20h — 52 pedidos/h", color: "text-blue-500 bg-blue-500/10" },
  { icon: Target, title: "Meta mensal", value: "94% concluída", color: "text-emerald-500 bg-emerald-500/10" },
];

export default function Desempenho() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Desempenho</h1>
        <p className="text-sm text-muted-foreground mt-0.5">KPIs e progresso de metas do negócio</p>
      </div>

      {/* Destaques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {destaques.map((d, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${d.color}`}>
              <d.icon className="w-4.5 h-4.5" />
            </div>
            <p className="text-xs text-muted-foreground">{d.title}</p>
            <p className="text-[14px] font-bold text-foreground mt-1">{d.value}</p>
          </div>
        ))}
      </div>

      {/* Metas */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Progresso de Metas — Maio 2026</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metas.map((m, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs text-muted-foreground mb-3">{m.label}</p>
              <div className="flex items-end gap-3 mb-3">
                <div className="w-[80px] h-[80px] relative flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%" cy="50%"
                      innerRadius="60%" outerRadius="100%"
                      startAngle={90} endAngle={90 - (m.pct / 100) * 360}
                      data={[{ value: m.pct, fill: m.color }]}
                    >
                      <RadialBar dataKey="value" cornerRadius={4} background={{ fill: "hsl(var(--muted))" }} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[14px] font-bold text-foreground">{m.pct}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Atual</p>
                  <p className="text-[15px] font-bold text-foreground">{m.atual}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Meta: {m.meta}</p>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${m.pct}%`, backgroundColor: m.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily performance table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Desempenho da Semana vs Meta Diária</h3>
          <span className="text-xs text-muted-foreground">Meta: 50 pedidos/dia</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border">
                {["Dia", "Pedidos Realizados", "Meta", "Variação", "Status"].map(h => (
                  <th key={h} className="text-left py-3 px-5 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kpiSemana.map((d, i) => {
                const diff = d.pedidos - d.meta;
                const atingiu = d.pedidos >= d.meta;
                return (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-foreground">{d.dia}</td>
                    <td className="py-3.5 px-5 font-bold text-foreground">{d.pedidos}</td>
                    <td className="py-3.5 px-5 text-muted-foreground">{d.meta}</td>
                    <td className="py-3.5 px-5">
                      <span className={`flex items-center gap-1 text-xs font-semibold ${atingiu ? "text-emerald-500" : "text-red-500"}`}>
                        {atingiu ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {atingiu ? "+" : ""}{diff} pedidos
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${atingiu ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-red-500 bg-red-500/10 border-red-500/20"}`}>
                        {atingiu ? "Meta atingida" : "Abaixo da meta"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
