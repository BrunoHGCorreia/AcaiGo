"use client";

import Link from "next/link";
import {
  DollarSign, ShoppingBag, Users, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Eye, Edit2, Trash2, Target,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

// ─── DATA ────────────────────────────────────────────────────────────────────

const revenueData = [
  { hour: "8h", value: 120 },
  { hour: "9h", value: 340 },
  { hour: "10h", value: 580 },
  { hour: "11h", value: 920 },
  { hour: "12h", value: 1640 },
  { hour: "13h", value: 1980 },
  { hour: "14h", value: 2200 },
  { hour: "15h", value: 1850 },
  { hour: "16h", value: 2458 },
];

const weekData = [
  { day: "Seg", value: 1820 },
  { day: "Ter", value: 2340 },
  { day: "Qua", value: 1980 },
  { day: "Qui", value: 2760 },
  { day: "Sex", value: 3100 },
  { day: "Sáb", value: 3840 },
  { day: "Dom", value: 2200 },
];

const statusData = [
  { name: "Concluído", value: 42, color: "#10b981" },
  { name: "Entrega", value: 18, color: "#7c3aed" },
  { name: "Preparo", value: 12, color: "#f59e0b" },
  { name: "Pedido", value: 6, color: "#94a3b8" },
];

const funnelData = [
  { stage: "Pedido", count: 78, pct: 100, color: "#7c3aed" },
  { stage: "Preparo", count: 72, pct: 92, color: "#9d5cf5" },
  { stage: "Entrega", count: 64, pct: 82, color: "#c084fc" },
  { stage: "Concluído", count: 58, pct: 74, color: "#10b981" },
];

const orders = [
  { id: "#1257", client: "João Silva", initials: "JS", date: "Hoje, 14:32", value: "R$ 58,90", status: "Concluído", statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  { id: "#1256", client: "Maria Oliveira", initials: "MO", date: "Hoje, 14:12", value: "R$ 42,50", status: "Entrega", statusColor: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  { id: "#1255", client: "Carlos Santos", initials: "CS", date: "Hoje, 13:45", value: "R$ 37,90", status: "Preparo", statusColor: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  { id: "#1254", client: "Ana Costa", initials: "AC", date: "Hoje, 13:20", value: "R$ 68,00", status: "Pedido", statusColor: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
  { id: "#1253", client: "Lucas Martins", initials: "LM", date: "Hoje, 12:58", value: "R$ 55,00", status: "Concluído", statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
];

// ─── REUSABLE COMPONENTS ─────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card text-card-foreground shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex flex-col space-y-1 p-3.5 pb-2 ${className}`}>{children}</div>;
}

function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-xs font-medium text-muted-foreground ${className}`}>{children}</h3>;
}

function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-3.5 pb-3.5 ${className}`}>{children}</div>;
}

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-semibold text-foreground">
          R$ {payload[0].value.toLocaleString("pt-BR")}
        </p>
      </div>
    );
  }
  return null;
};

const BarTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-semibold text-foreground">
          R$ {payload[0].value.toLocaleString("pt-BR")}
        </p>
      </div>
    );
  }
  return null;
};

// ─── KPI CARD ────────────────────────────────────────────────────────────────

function KpiCard({
  title, value, delta, deltaPositive, icon: Icon, iconColor, sparkData, sparkColor,
}: {
  title: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  icon: React.ElementType;
  iconColor: string;
  sparkData: { value: number }[];
  sparkColor: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconColor}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xl font-bold tracking-tight text-foreground">{value}</div>
        <div className={`flex items-center gap-1 mt-0.5 text-[11px] font-medium ${deltaPositive ? "text-emerald-500" : "text-red-500"}`}>
          {deltaPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          <span>{delta} vs ontem</span>
        </div>
        <div className="mt-2 h-9 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient id={`g-${sparkColor.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={sparkColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={sparkColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={sparkColor}
                strokeWidth={1.5}
                fill={`url(#g-${sparkColor.replace("#", "")})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function Dashboard() {
  const totalOrders = statusData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-4">

      {/* ── ROW 1: 4 KPI cards + 1 image column ─────────────────────── */}
      <div
        className="grid grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_270px] gap-3 lg:gap-4"
      >
        <KpiCard
          title="Faturamento Hoje"
          value="R$ 2.458,90"
          delta="+18,6%"
          deltaPositive={true}
          icon={DollarSign}
          iconColor="bg-violet-500/15 text-violet-500"
          sparkData={revenueData}
          sparkColor="#7c3aed"
        />
        <KpiCard
          title="Pedidos Hoje"
          value="78"
          delta="+14,3%"
          deltaPositive={true}
          icon={ShoppingBag}
          iconColor="bg-blue-500/15 text-blue-500"
          sparkData={weekData}
          sparkColor="#3b82f6"
        />
        <KpiCard
          title="Novos Clientes"
          value="12"
          delta="+9,1%"
          deltaPositive={true}
          icon={Users}
          iconColor="bg-emerald-500/15 text-emerald-500"
          sparkData={[...weekData].reverse()}
          sparkColor="#10b981"
        />
        <KpiCard
          title="Ticket Médio"
          value="R$ 31,52"
          delta="-3,8%"
          deltaPositive={false}
          icon={Target}
          iconColor="bg-amber-500/15 text-amber-500"
          sparkData={weekData.map((d, i) => ({ value: d.value / (10 + i) }))}
          sparkColor="#f59e0b"
        />

        {/* 5th column — image only visible on xl */}
        <div className="hidden xl:flex items-end justify-center relative overflow-visible">
          <div className="relative w-full" style={{ marginBottom: "-24px" }}>
            <img
              src="/images/1.png"
              alt="Açaí Go"
              className="w-full h-auto object-contain drop-shadow-[0_28px_56px_rgba(124,58,237,0.65)] hover:scale-105 transition-transform duration-300 relative z-10"
            />
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: "80%",
                height: "24px",
                background: "radial-gradient(ellipse at center, rgba(124,58,237,0.85) 0%, rgba(109,40,217,0.35) 55%, transparent 80%)",
                filter: "blur(12px)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── ROW 2: Revenue Chart + Status Chart ──────────────────── */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">

        {/* Revenue Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Faturamento do Dia</CardTitle>
                <p className="text-xl font-bold text-foreground mt-1">R$ 2.458,90</p>
                <p className="text-xs text-emerald-500 flex items-center gap-1 mt-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  +21,3% comparado a ontem
                </p>
              </div>
              <select className="text-xs border border-border rounded-md px-2.5 py-1.5 bg-background text-muted-foreground outline-none focus:ring-2 focus:ring-ring/20 cursor-pointer">
                <option>Hoje</option>
                <option>Semana</option>
                <option>Mês</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} dy={8} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    fill="url(#revGrad)"
                    activeDot={{ r: 4, fill: "#7c3aed", strokeWidth: 2, stroke: "#fff" }}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Donut */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Status dos Pedidos</CardTitle>
              <span className="text-xs text-muted-foreground">Hoje</span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5">
            {/* Donut — larger and centered */}
            <div className="relative w-[150px] h-[150px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%" cy="50%"
                    innerRadius={46} outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={4}
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-foreground">{totalOrders}</span>
                <span className="text-[10px] uppercase text-muted-foreground tracking-wider">Total</span>
              </div>
            </div>

            {/* Legend — full width below chart */}
            <div className="w-full space-y-3">
              {statusData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{item.value}</span>
                    <span className="text-xs text-muted-foreground w-10 text-right">({Math.round((item.value / totalOrders) * 100)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── ROW 3: Orders Table + Funnel + Weekly Bar ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">

        {/* Orders Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Pedidos Recentes</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Últimos pedidos do dia</p>
              </div>
              <Link href="/pedidos" className="text-xs font-medium text-primary hover:underline">Ver todos</Link>
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] min-w-[600px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2.5 font-medium text-muted-foreground pl-1 pr-3">ID</th>
                    <th className="text-left py-2.5 font-medium text-muted-foreground pr-3">Cliente</th>
                    <th className="text-left py-2.5 font-medium text-muted-foreground pr-3 hidden sm:table-cell">Data</th>
                    <th className="text-left py-2.5 font-medium text-muted-foreground pr-3">Status</th>
                    <th className="text-right py-2.5 font-medium text-muted-foreground pr-4">Valor</th>
                    <th className="text-right py-2.5 font-medium text-muted-foreground pr-1">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 pl-1 pr-3">
                        <span className="font-mono font-semibold text-primary">{order.id}</span>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                            {order.initials}
                          </div>
                          <span className="font-medium text-foreground whitespace-nowrap">{order.client}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-3 text-muted-foreground hidden sm:table-cell whitespace-nowrap">{order.date}</td>
                      <td className="py-3 pr-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right font-semibold text-foreground whitespace-nowrap">{order.value}</td>
                      <td className="py-3 pr-1 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Ver pedido">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Editar">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors" title="Excluir">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right column: Funnel + Weekly */}
        <div className="flex flex-col gap-4">

          {/* Funil de Pedidos */}
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Funil de Pedidos</h3>
                <Link href="/pedidos" className="text-xs font-medium text-primary hover:underline">Ver todos</Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {funnelData.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-muted-foreground">{item.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{item.count}</span>
                      <span className="text-muted-foreground">{item.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weekly Bar Chart */}
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle>Faturamento Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[110px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} dy={5} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<BarTooltip />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {weekData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={i === weekData.length - 2 ? "#7c3aed" : "hsl(var(--muted))"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  );
}
