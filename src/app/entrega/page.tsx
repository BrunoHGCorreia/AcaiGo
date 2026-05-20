"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  MapPin, Package, CreditCard, Banknote, QrCode, Wallet,
  CheckCircle, Clock, Truck, ChevronRight, Phone, ShieldX
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

const fetcher = (url: string) => fetch(url).then(r => r.json());

type Pagamento = "Crédito" | "Débito" | "Pix" | "Dinheiro" | "Vale Alimentação" | "Vale Refeição";
type StatusEntrega = "Pendente" | "Em Rota" | "Entregue";

type Entrega = {
  id: number;
  endereco: string;
  bairro: string;
  complemento?: string;
  itens: string;
  valor: number;
  pagamento: Pagamento;
  status: StatusEntrega;
  cliente: string;
  telefone?: string;
  createdAt: string;
};

const pagamentoConfig: Record<Pagamento, { icon: any; color: string; bg: string }> = {
  "Crédito":         { icon: CreditCard, color: "text-blue-400",    bg: "bg-blue-400/10" },
  "Débito":          { icon: CreditCard, color: "text-cyan-400",    bg: "bg-cyan-400/10" },
  "Pix":             { icon: QrCode,     color: "text-emerald-400", bg: "bg-emerald-400/10" },
  "Dinheiro":        { icon: Banknote,   color: "text-yellow-400",  bg: "bg-yellow-400/10" },
  "Vale Alimentação":{ icon: Wallet,     color: "text-orange-400",  bg: "bg-orange-400/10" },
  "Vale Refeição":   { icon: Wallet,     color: "text-rose-400",    bg: "bg-rose-400/10" },
};

const statusConfig: Record<StatusEntrega, { color: string; bg: string; border: string; icon: any; label: string }> = {
  "Pendente": { color: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/20",   icon: Clock,       label: "Aguardando" },
  "Em Rota":  { color: "text-violet-400",  bg: "bg-violet-400/10",  border: "border-violet-400/20",  icon: Truck,       label: "Em Rota" },
  "Entregue": { color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", icon: CheckCircle, label: "Entregue" },
};

// Mock data — will be replaced by real API when /api/entregas is ready
const mockEntregas: Entrega[] = [
  {
    id: 1,
    endereco: "Rua das Flores, 123",
    bairro: "Centro",
    complemento: "Apto 4B",
    itens: "Açaí 500ml + Granola + Leite Condensado",
    valor: 28.90,
    pagamento: "Pix",
    status: "Em Rota",
    cliente: "João Silva",
    telefone: "(11) 99999-1234",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    endereco: "Av. Paulista, 1578",
    bairro: "Bela Vista",
    itens: "Açaí 300ml x2",
    valor: 35.80,
    pagamento: "Crédito",
    status: "Pendente",
    cliente: "Maria Oliveira",
    telefone: "(11) 98888-5678",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    endereco: "Rua Augusta, 890",
    bairro: "Consolação",
    complemento: "Casa",
    itens: "Açaí 700ml + Morango + Mel",
    valor: 42.50,
    pagamento: "Dinheiro",
    status: "Entregue",
    cliente: "Carlos Santos",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 4,
    endereco: "Rua Oscar Freire, 200",
    bairro: "Jardins",
    itens: "Combo Família 1L",
    valor: 58.00,
    pagamento: "Vale Refeição",
    status: "Pendente",
    cliente: "Ana Costa",
    telefone: "(11) 97777-9012",
    createdAt: new Date().toISOString(),
  },
];

function EntregaCard({ entrega, onConfirm }: { entrega: Entrega; onConfirm: (id: number) => void }) {
  const pag = pagamentoConfig[entrega.pagamento];
  const st = statusConfig[entrega.status];
  const PagIcon = pag.icon;
  const StIcon = st.icon;

  return (
    <div className={`rounded-2xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5 ${
      entrega.status === "Em Rota" ? "border-violet-500/30 shadow-md shadow-violet-500/10" :
      entrega.status === "Entregue" ? "border-emerald-500/20 opacity-70" :
      "border-border"
    }`}>
      {/* Status bar */}
      <div className={`h-1.5 w-full ${
        entrega.status === "Em Rota" ? "bg-violet-500" :
        entrega.status === "Entregue" ? "bg-emerald-500" :
        "bg-amber-400"
      }`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-primary">#{entrega.id.toString().padStart(4, "0")}</span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${st.color} ${st.bg} ${st.border}`}>
              <StIcon className="w-3 h-3" />
              {st.label}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(entrega.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-foreground leading-snug">{entrega.endereco}</p>
            {entrega.complemento && (
              <p className="text-xs text-muted-foreground">{entrega.complemento}</p>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">{entrega.bairro}</p>
          </div>
        </div>

        {/* Client */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/50">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary flex-shrink-0">
            {entrega.cliente.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()}
          </div>
          <span className="text-[13px] text-foreground font-medium">{entrega.cliente}</span>
          {entrega.telefone && (
            <a href={`tel:${entrega.telefone}`} className="ml-auto flex items-center gap-1 text-xs text-primary hover:underline">
              <Phone className="w-3 h-3" />
              {entrega.telefone}
            </a>
          )}
        </div>

        {/* Items */}
        <div className="flex items-start gap-2 mb-4">
          <Package className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-muted-foreground leading-relaxed">{entrega.itens}</p>
        </div>

        {/* Payment + Value */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${pag.bg}`}>
            <PagIcon className={`w-3.5 h-3.5 ${pag.color}`} />
            <span className={`text-[11px] font-semibold ${pag.color}`}>{entrega.pagamento}</span>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-muted-foreground">Valor a cobrar</p>
            <p className="text-lg font-bold text-foreground">
              R$ {entrega.valor.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </div>

        {/* Action */}
        {entrega.status !== "Entregue" && (
          <button
            onClick={() => onConfirm(entrega.id)}
            className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              entrega.status === "Pendente"
                ? "bg-violet-500 text-white hover:bg-violet-600 shadow-md shadow-violet-500/20"
                : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20"
            }`}
          >
            {entrega.status === "Pendente" ? (
              <><Truck className="w-4 h-4" /> Iniciar Entrega</>
            ) : (
              <><CheckCircle className="w-4 h-4" /> Confirmar Entregue</>
            )}
            <ChevronRight className="w-4 h-4 ml-auto" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function EntregaPage() {
  const { can, isLoading } = usePermissions();
  const [entregas, setEntregas] = useState<Entrega[]>(mockEntregas);
  const [filter, setFilter] = useState<StatusEntrega | "Todas">("Todas");

  const handleConfirm = (id: number) => {
    setEntregas(prev => prev.map(e => {
      if (e.id !== id) return e;
      const next: StatusEntrega = e.status === "Pendente" ? "Em Rota" : "Entregue";
      return { ...e, status: next };
    }));
  };

  const filtered = filter === "Todas" ? entregas : entregas.filter(e => e.status === filter);
  const counts = {
    Pendente: entregas.filter(e => e.status === "Pendente").length,
    "Em Rota": entregas.filter(e => e.status === "Em Rota").length,
    Entregue: entregas.filter(e => e.status === "Entregue").length,
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-40">
      <Truck className="w-6 h-6 animate-bounce text-primary" />
    </div>
  );

  if (!can("entrega:view")) return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <ShieldX className="w-12 h-12 mb-3 opacity-30" />
      <p className="text-sm font-medium">Acesso restrito</p>
      <p className="text-xs mt-1">Você não tem permissão para ver esta página.</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Minhas Entregas</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Pedidos designados para entrega hoje</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3">
        {(["Pendente", "Em Rota", "Entregue"] as StatusEntrega[]).map(s => {
          const st = statusConfig[s];
          const StIcon = st.icon;
          return (
            <div
              key={s}
              onClick={() => setFilter(filter === s ? "Todas" : s)}
              className={`rounded-xl border p-4 cursor-pointer transition-all ${
                filter === s ? `${st.bg} ${st.border} border` : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${st.bg}`}>
                <StIcon className={`w-4 h-4 ${st.color}`} />
              </div>
              <p className="text-xl font-bold text-foreground">{counts[s]}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{st.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {(["Todas", "Pendente", "Em Rota", "Entregue"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Truck className="w-12 h-12 mb-3 opacity-20" />
          <p className="text-sm">Nenhuma entrega {filter !== "Todas" ? `com status "${filter}"` : "para hoje"}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(e => (
            <EntregaCard key={e.id} entrega={e} onConfirm={handleConfirm} />
          ))}
        </div>
      )}
    </div>
  );
}
