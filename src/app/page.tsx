"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import {
  DollarSign, ShoppingBag, Users, TrendingUp,
  ArrowUpRight, ArrowDownRight, Eye, Edit2, Trash2, Target,
  X, AlertTriangle, ShieldX, ShoppingCart,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/contexts/AuthContext";
import { useVitrine } from "@/contexts/VitrineContext";
import { useLanguage } from "@/contexts/LanguageContext";
import toast from "react-hot-toast";

const fetcher = (url: string) => fetch(url).then(r => r.json());

// ─── DATA ─────────────────────────────────────────────────────────────────────

const revenueData = [
  { hour: "8h",  value: 120 },
  { hour: "9h",  value: 340 },
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
  { name: "Entrega",   value: 18, color: "#7c3aed" },
  { name: "Preparo",   value: 12, color: "#f59e0b" },
  { name: "Pedido",    value: 6,  color: "#94a3b8" },
];

const funnelData = [
  { stage: "Pedido",    count: 78, pct: 100, color: "#7c3aed" },
  { stage: "Preparo",   count: 72, pct: 92,  color: "#9d5cf5" },
  { stage: "Entrega",   count: 64, pct: 82,  color: "#c084fc" },
  { stage: "Concluído", count: 58, pct: 74,  color: "#10b981" },
];

const orders = [
  { id: "#1257", numId: 1257, client: "João Silva",     initials: "JS", date: "Hoje, 14:32", value: "R$ 58,90", status: "Concluído", statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  { id: "#1256", numId: 1256, client: "Maria Oliveira", initials: "MO", date: "Hoje, 14:12", value: "R$ 42,50", status: "Entrega",   statusColor: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  { id: "#1255", numId: 1255, client: "Carlos Santos",  initials: "CS", date: "Hoje, 13:45", value: "R$ 37,90", status: "Preparo",   statusColor: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  { id: "#1254", numId: 1254, client: "Ana Costa",      initials: "AC", date: "Hoje, 13:20", value: "R$ 68,00", status: "Pedido",    statusColor: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
  { id: "#1253", numId: 1253, client: "Lucas Martins",  initials: "LM", date: "Hoje, 12:58", value: "R$ 55,00", status: "Concluído", statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
];

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────

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

// ─── CUSTOM TOOLTIPS ──────────────────────────────────────────────────────────

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

// ─── KPI CARD ─────────────────────────────────────────────────────────────────

function KpiCard({
  title, value, delta, deltaPositive, icon: Icon, iconColor, sparkData, sparkColor,
}: {
  title: string; value: string; delta: string; deltaPositive: boolean;
  icon: React.ElementType; iconColor: string;
  sparkData: { value: number }[]; sparkColor: string;
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
                  <stop offset="5%"  stopColor={sparkColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={sparkColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone" dataKey="value"
                stroke={sparkColor} strokeWidth={1.5}
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

// ─── DELETE CONFIRMATION MODAL ────────────────────────────────────────────────

function DeleteModal({
  orderId, onClose, onConfirm,
}: { orderId: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl mx-4">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Excluir pedido {orderId}?</h2>
            <p className="text-sm text-muted-foreground mt-1">Esta ação não pode ser desfeita. O pedido será removido permanentemente.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-border rounded-lg py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ORDER DETAIL MODAL ───────────────────────────────────────────────────────

function OrderDetailModal({ order, onClose }: { order: typeof orders[0]; onClose: () => void }) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-xs font-mono font-bold text-primary">{order.id}</span>
            <h2 className="text-base font-semibold text-foreground mt-0.5">Detalhes do Pedido</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {order.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{order.client}</p>
              <p className="text-xs text-muted-foreground">{order.date}</p>
            </div>
            <span className={`ml-auto inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${order.statusColor}`}>
              {order.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/20 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Valor</p>
              <p className="text-base font-bold text-foreground">{order.value}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/20 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="text-sm font-semibold text-foreground">{order.status}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border border-border rounded-lg py-2.5 text-sm font-medium hover:bg-muted transition-colors">
            Fechar
          </button>
          <button
            onClick={() => { onClose(); router.push("/pedidos"); }}
            className="flex-1 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Ir para Pedidos
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MOTOBOY DASHBOARD ────────────────────────────────────────────────────────

function MotoboyDashboard() {
  const { usuario } = useAuth();
  const router = useRouter();
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-foreground">Olá, {usuario?.nome?.split(" ")[0] ?? "Entregador"}! 👋</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Aqui estão suas entregas de hoje</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pendentes", value: "2", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
          { label: "Em Rota",   value: "1", color: "text-violet-400 bg-violet-400/10 border-violet-400/20" },
          { label: "Entregues", value: "3", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs mt-1 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => router.push("/entrega")}
        className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
      >
        Ver Minhas Entregas →
      </button>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { can, role, isLoading } = usePermissions();
  const { usuario } = useAuth();
  const { isVitrine } = useVitrine();
  const { t, lang } = useLanguage();
  const router = useRouter();

  const [viewingOrder, setViewingOrder] = useState<typeof orders[0] | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<typeof orders[0] | null>(null);
  const [localOrders, setLocalOrders] = useState(orders);

  // Demo mode: not logged in OR vitrine is active
  const isDemo = (!usuario && !isLoading) || isVitrine;

  // ─── Fetch real data when logged in ───────────────────────────────
  const { data: apiData } = useSWR(
    !isDemo ? "/api/dashboard" : null,
    fetcher,
    { refreshInterval: 30000 }
  );

  // ─── Real data (zeros when empty) ─────────────────────────────────
  const realKpis = apiData?.kpis || { faturamentoHoje: 0, pedidosHoje: 0, novosClientes: 0 };
  const realStatus = apiData?.statusPedidos || { Pedido: 0, Preparo: 0, Entrega: 0, "Concluído": 0 };
  const realRecentOrders: any[] = apiData?.pedidosRecentes || [];
  const realGrafico = apiData?.graficoHoras?.length
    ? apiData.graficoHoras
    : Array.from({ length: 9 }, (_, i) => ({ hour: `${8 + i}h`, value: 0 }));

  const realTicket = realKpis.pedidosHoje > 0
    ? (realKpis.faturamentoHoje / realKpis.pedidosHoje)
    : 0;

  const fmtBRL = (v: number) =>
    v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // ─── Status label map (translatable) ──────────────────────────────
  const statusLabelMap: Record<string, string> = {
    "Concluído": t("status.concluido"),
    "Entrega":    t("status.entrega"),
    "Preparo":    t("status.preparo"),
    "Pedido":     t("status.pedido"),
  };
  const statusColorMap: Record<string, string> = {
    "Concluído": "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    "Entrega":    "text-violet-400 bg-violet-500/10 border-violet-500/20",
    "Preparo":    "text-amber-500 bg-amber-500/10 border-amber-500/20",
    "Pedido":     "text-slate-400 bg-slate-500/10 border-slate-500/20",
  };

  // ─── Display data (switches between demo and real) ─────────────────
  const displayFaturamento = isDemo ? "R$ 2.458,90" : `R$ ${fmtBRL(realKpis.faturamentoHoje)}`;
  const displayPedidos     = isDemo ? "78"           : String(realKpis.pedidosHoje);
  const displayClientes    = isDemo ? "12"           : String(realKpis.novosClientes);
  const displayTicket      = isDemo ? "R$ 31,52"    : `R$ ${fmtBRL(realTicket)}`;
  const displayGrafico     = isDemo ? revenueData   : realGrafico;
  const displayWeek        = isDemo ? weekData       : weekData.map(d => ({ ...d, value: 0 }));

  const displayStatusData = isDemo ? statusData : [
    { name: t("status.concluido"), value: realStatus["Concluído"] || 0, color: "#10b981" },
    { name: t("status.entrega"),   value: realStatus["Entrega"]   || 0, color: "#7c3aed" },
    { name: t("status.preparo"),   value: realStatus["Preparo"]   || 0, color: "#f59e0b" },
    { name: t("status.pedido"),    value: realStatus["Pedido"]    || 0, color: "#94a3b8" },
  ];
  const displayTotalOrders = displayStatusData.reduce((s, d) => s + d.value, 0);

  const displayFunnelData = isDemo ? funnelData : (() => {
    const total = realStatus["Pedido"] || 0;
    return [
      { stage: t("status.pedido"),     count: total,                          pct: 100, color: "#7c3aed" },
      { stage: t("status.preparo"),    count: realStatus["Preparo"]   || 0,   pct: total > 0 ? Math.round(((realStatus["Preparo"] || 0) / total) * 100) : 0, color: "#9d5cf5" },
      { stage: t("status.entrega"),    count: realStatus["Entrega"]   || 0,   pct: total > 0 ? Math.round(((realStatus["Entrega"] || 0) / total) * 100) : 0, color: "#c084fc" },
      { stage: t("status.concluido"),  count: realStatus["Concluído"] || 0,  pct: total > 0 ? Math.round(((realStatus["Concluído"] || 0) / total) * 100) : 0, color: "#10b981" },
    ];
  })();

  const displayOrders = isDemo ? localOrders : realRecentOrders.map((p: any) => {
    const names = (p.cliente?.nome || "Cliente").split(" ");
    const initials = names.slice(0, 2).map((w: string) => w[0] ?? "").join("").toUpperCase();
    const date = new Date(p.createdAt);
    const dateStr = lang === "pt"
      ? `Hoje, ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
      : lang === "en"
      ? `Today, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
      : `Hoy, ${date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`;
    return {
      id: `#${p.id}`, numId: p.id,
      client: p.cliente?.nome || "Cliente", initials,
      date: dateStr,
      value: `R$ ${fmtBRL(Number(p.total))}`,
      status: statusLabelMap[p.status] || p.status,
      statusColor: statusColorMap[p.status] || "text-slate-400 bg-slate-500/10 border-slate-500/20",
    };
  });

  const handleDelete = (order: typeof orders[0]) => {
    if (isDemo) {
      toast("🔒 Faça login para excluir pedidos reais.", { icon: "🎭" });
      setDeletingOrder(null);
      return;
    }
    setLocalOrders(prev => prev.filter(o => o.id !== order.id));
    setDeletingOrder(null);
    toast.success(`Pedido ${order.id} removido com sucesso!`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // MOTOBOY sees a simplified delivery-focused dashboard (not in demo mode)
  if (!isDemo && role === "MOTOBOY") {
    return <MotoboyDashboard />;
  }

  // Not logged in and no permission: show demo dashboard (with fake data already in file)
  // If logged in but no permission: show restricted
  if (!isDemo && !can("dashboard:view")) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <ShieldX className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm font-medium">Acesso restrito</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-4">

      {/* ── ROW 1: 4 KPI cards + image ──────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_270px] gap-3 lg:gap-4">
        <KpiCard title={t("kpi.faturamentoHoje")} value={displayFaturamento} delta={isDemo ? "+18,6%" : "+0%"} deltaPositive={true}
          icon={DollarSign} iconColor="bg-violet-500/15 text-violet-500"
          sparkData={displayGrafico} sparkColor="#7c3aed" />
        <KpiCard title={t("kpi.pedidosHoje")} value={displayPedidos} delta={isDemo ? "+14,3%" : "+0%"} deltaPositive={true}
          icon={ShoppingBag} iconColor="bg-blue-500/15 text-blue-500"
          sparkData={displayWeek.map(d => ({ value: d.value }))} sparkColor="#3b82f6" />
        <KpiCard title={t("kpi.novosClientes")} value={displayClientes} delta={isDemo ? "+9,1%" : "+0%"} deltaPositive={true}
          icon={Users} iconColor="bg-emerald-500/15 text-emerald-500"
          sparkData={displayWeek.map(d => ({ value: d.value / 10 })).reverse()} sparkColor="#10b981" />
        <KpiCard title={t("kpi.ticketMedio")} value={displayTicket} delta={isDemo ? "-3,8%" : "+0%"} deltaPositive={false}
          icon={Target} iconColor="bg-amber-500/15 text-amber-500"
          sparkData={displayWeek.map((d, i) => ({ value: d.value / (10 + i) }))} sparkColor="#f59e0b" />

        {/* 5th column — image */}
        <div className="hidden xl:flex items-end justify-center relative overflow-visible">
          <div className="relative w-full" style={{ marginBottom: "-24px" }}>
            <img
              src="/images/1.png" alt="Açaí Go"
              className="w-full h-auto object-contain drop-shadow-[0_28px_56px_rgba(124,58,237,0.65)] hover:scale-105 transition-transform duration-300 relative z-10"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full"
              style={{ width: "80%", height: "24px",
                background: "radial-gradient(ellipse at center, rgba(124,58,237,0.85) 0%, rgba(109,40,217,0.35) 55%, transparent 80%)",
                filter: "blur(12px)" }} />
          </div>
        </div>
      </div>

      {/* ── ROW 2: Revenue Chart + Status Donut ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{t("dash.faturamentoDia")}</CardTitle>
                <p className="text-xl font-bold text-foreground mt-1">{displayFaturamento}</p>
                {isDemo && (
                  <p className="text-xs text-emerald-500 flex items-center gap-1 mt-0.5">
                    <ArrowUpRight className="w-3 h-3" /> {t("dash.comparadoOntem")}
                  </p>
                )}
              </div>
              <select className="text-xs border border-border rounded-md px-2.5 py-1.5 bg-background text-muted-foreground outline-none focus:ring-2 focus:ring-ring/20 cursor-pointer">
                <option>{t("dash.hoje")}</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayGrafico} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} dy={8} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2} fill="url(#revGrad)"
                    activeDot={{ r: 4, fill: "#7c3aed", strokeWidth: 2, stroke: "#fff" }} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t("dash.statusPedidos")}</CardTitle>
              <span className="text-xs text-muted-foreground">{t("dash.hoje")}</span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5">
            <div className="relative w-[150px] h-[150px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={displayStatusData} cx="50%" cy="50%" innerRadius={46} outerRadius={68}
                    paddingAngle={3} dataKey="value" stroke="none" cornerRadius={4}>
                    {displayStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-foreground">{displayTotalOrders}</span>
                <span className="text-[10px] uppercase text-muted-foreground tracking-wider">{t("dash.totalPedidos")}</span>
              </div>
            </div>
            <div className="w-full space-y-3">
              {displayStatusData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{item.value}</span>
                    <span className="text-xs text-muted-foreground w-10 text-right">({displayTotalOrders > 0 ? Math.round((item.value / displayTotalOrders) * 100) : 0}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── ROW 3: Orders Table + Funnel + Weekly Bar ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">

        {/* Orders Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{t("dash.pedidosRecentes")}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{t("dash.ultimosPedidos")}</p>
              </div>
              <Link href="/pedidos" className="text-xs font-medium text-primary hover:underline">{t("dash.verTodos")}</Link>
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] min-w-[600px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2.5 font-medium text-muted-foreground pl-1 pr-3">{t("table.id")}</th>
                    <th className="text-left py-2.5 font-medium text-muted-foreground pr-3">{t("table.cliente")}</th>
                    <th className="text-left py-2.5 font-medium text-muted-foreground pr-3 hidden sm:table-cell">{t("table.data")}</th>
                    <th className="text-left py-2.5 font-medium text-muted-foreground pr-3">{t("table.status")}</th>
                    <th className="text-right py-2.5 font-medium text-muted-foreground pr-4">{t("table.valor")}</th>
                    <th className="text-right py-2.5 font-medium text-muted-foreground pr-1">{t("table.acoes")}</th>
                  </tr>
                </thead>
                <tbody>
                  {displayOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <ShoppingCart className="w-8 h-8 opacity-20" />
                          <p className="text-sm">{t("dash.nenhumPedido")}</p>
                          <p className="text-xs">{t("dash.inicieCadastrando")}</p>
                          <Link href="/pedidos" className="mt-2 text-xs font-medium text-primary hover:underline">{t("dash.addPedido")}</Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    displayOrders.map((order, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                      <td className="py-3 pl-1 pr-3">
                        <button
                          onClick={() => setViewingOrder(order)}
                          className="font-mono font-semibold text-primary hover:underline cursor-pointer"
                        >
                          {order.id}
                        </button>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                            {order.initials}
                          </div>
                          <button
                            onClick={() => setViewingOrder(order)}
                            className="font-medium text-foreground whitespace-nowrap hover:text-primary transition-colors"
                          >
                            {order.client}
                          </button>
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
                        <div className="flex items-center justify-end gap-1">
                          {/* View */}
                          <button
                            onClick={() => setViewingOrder(order)}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {/* Edit → go to pedidos */}
                          <button
                            onClick={() => {
                              toast.success(`Editando pedido ${order.id}...`);
                              router.push("/pedidos");
                            }}
                            className="p-1.5 rounded-lg hover:bg-amber-500/10 text-muted-foreground hover:text-amber-500 transition-colors"
                            title="Editar pedido"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {/* Delete */}
                          {can("pedidos:delete") && (
                            <button
                              onClick={() => setDeletingOrder(order)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                              title="Excluir pedido"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right column: Funnel + Weekly */}
        <div className="flex flex-col gap-4">

          <Card className="flex-1">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">{t("dash.funilPedidos")}</h3>
                <Link href="/pedidos" className="text-xs font-medium text-primary hover:underline">{t("dash.verTodos")}</Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {displayFunnelData.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-muted-foreground">{item.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{item.count}</span>
                      <span className="text-muted-foreground">{item.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle>{t("dash.faturamentoSemanal")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[110px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displayWeek} margin={{ top: 0, right: 0, left: -30, bottom: 0 }} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} dy={5} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<BarTooltip />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {weekData.map((_, i) => (
                        <Cell key={i} fill={i === weekData.length - 2 ? "#7c3aed" : "hsl(var(--muted))"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Modals */}
      {viewingOrder && (
        <OrderDetailModal order={viewingOrder} onClose={() => setViewingOrder(null)} />
      )}
      {deletingOrder && (
        <DeleteModal
          orderId={deletingOrder.id}
          onClose={() => setDeletingOrder(null)}
          onConfirm={() => handleDelete(deletingOrder)}
        />
      )}

    </div>
  );
}
