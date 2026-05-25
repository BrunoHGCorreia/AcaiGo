"use client";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BarChart2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const monthlyRevenue = [
  { mes: "Jan", valor: 18200 }, { mes: "Fev", valor: 21400 }, { mes: "Mar", valor: 19800 },
  { mes: "Abr", valor: 24600 }, { mes: "Mai", valor: 28300 },
];
const hourlyOrders = [
  { hora: "8h", pedidos: 4 }, { hora: "9h", pedidos: 12 }, { hora: "10h", pedidos: 18 },
  { hora: "11h", pedidos: 24 }, { hora: "12h", pedidos: 38 }, { hora: "13h", pedidos: 42 },
  { hora: "14h", pedidos: 35 }, { hora: "15h", pedidos: 28 }, { hora: "16h", pedidos: 22 },
  { hora: "17h", pedidos: 30 }, { hora: "18h", pedidos: 45 }, { hora: "19h", pedidos: 52 },
  { hora: "20h", pedidos: 38 }, { hora: "21h", pedidos: 18 }, { hora: "22h", pedidos: 8 },
];
const clientesPie = [
  { name: "Recorrentes", value: 68, color: "#7c3aed" },
  { name: "Novos", value: 24, color: "#10b981" },
  { name: "Inativos", value: 8, color: "#94a3b8" },
];
const topBairros = [
  { bairro: "Centro", pedidos: 142, pct: 100 },
  { bairro: "Vila Nova", pedidos: 98, pct: 69 },
  { bairro: "Jardim das Flores", pedidos: 76, pct: 54 },
  { bairro: "Alto da Serra", pedidos: 54, pct: 38 },
  { bairro: "Outros", pedidos: 31, pct: 22 },
];

const CT = ({ active, payload, label }: any) => active && payload?.length ? (
  <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-xs">
    <p className="text-muted-foreground mb-1">{label}</p>
    <p className="font-semibold text-foreground">{payload[0].value}</p>
  </div>
) : null;

export default function Graficos() {
  const { usuario, loading } = useAuth();
  const isDemo = !usuario && !loading;
  const total = clientesPie.reduce((s, d) => s + d.value, 0);

  if (!isDemo) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gráficos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Analytics e visualizações de dados</p>
        </div>
        <div className="flex flex-col items-center justify-center py-28 rounded-2xl border border-dashed border-border bg-card text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <BarChart2 className="w-8 h-8 text-primary opacity-60" />
          </div>
          <h2 className="text-base font-semibold text-foreground mb-1">Nenhum dado para exibir</h2>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">Os gráficos serão gerados automaticamente conforme você adicionar pedidos, clientes e produtos.</p>
          <div className="flex gap-3">
            <Link href="/clientes" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Adicionar Clientes</Link>
            <Link href="/pedidos" className="border border-border text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors">Adicionar Pedidos</Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gráficos</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Analytics e visualizações de dados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue trend */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Faturamento Mensal</h3>
          <p className="text-xs text-muted-foreground mb-4">Evolução nos últimos 5 meses</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gM" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} dy={8} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
                <Tooltip content={({ active, payload, label }: any) => active && payload?.length ? (
                  <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-xs">
                    <p className="text-muted-foreground mb-1">{label}</p>
                    <p className="font-semibold text-foreground">R$ {payload[0].value.toLocaleString("pt-BR")}</p>
                  </div>
                ) : null} />
                <Area type="monotone" dataKey="valor" stroke="#7c3aed" strokeWidth={2} fill="url(#gM)" dot={{ r: 4, fill: "#7c3aed" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly orders */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Pedidos por Hora</h3>
          <p className="text-xs text-muted-foreground mb-4">Volume de pedidos ao longo do dia</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyOrders} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="hora" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} dy={5} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CT />} />
                <Bar dataKey="pedidos" fill="#9d5cf5" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Client types pie */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Perfil de Clientes</h3>
          <p className="text-xs text-muted-foreground mb-4">Recorrentes vs Novos vs Inativos</p>
          <div className="flex items-center gap-8">
            <div className="relative w-[160px] h-[160px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={clientesPie} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value" stroke="none" cornerRadius={4}>
                    {clientesPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-foreground">{total}</span>
                <span className="text-[10px] text-muted-foreground">clientes</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {clientesPie.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-[12px] mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">{item.value} ({Math.round((item.value/total)*100)}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.round((item.value/total)*100)}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top bairros */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Entregas por Bairro</h3>
          <p className="text-xs text-muted-foreground mb-4">Regiões com mais pedidos</p>
          <div className="space-y-4">
            {topBairros.map((b, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-[12px] mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <span className="font-medium text-foreground">{b.bairro}</span>
                  </div>
                  <span className="font-semibold text-foreground">{b.pedidos} pedidos</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
