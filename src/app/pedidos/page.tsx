"use client";
import { useState } from "react";
import useSWR from "swr";
import { Search, Plus, Eye, Edit2, Trash2, Package, Clock, Truck, CheckCircle, Loader2, X } from "lucide-react";
import PedidoModal from "@/components/modals/PedidoModal";
import ConfirmDelete from "@/components/modals/ConfirmDelete";
import { useAuth } from "@/contexts/AuthContext";
import { useVitrine } from "@/contexts/VitrineContext";
import { demoPedidos } from "@/lib/demo-data";
import toast from "react-hot-toast";

const fetcher = (url: string) => fetch(url).then(r => r.json());

type Status = "Pedido" | "Preparo" | "Entrega" | "Concluído";

const statusConfig: Record<Status, { color: string; bg: string; border: string; icon: any }> = {
  "Pedido":    { color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", icon: Package },
  "Preparo":   { color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Clock },
  "Entrega":   { color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", icon: Truck },
  "Concluído": { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle },
};

const allStatuses: Status[] = ["Pedido", "Preparo", "Entrega", "Concluído"];

type Pedido = {
  id: number;
  status: Status;
  total: number;
  createdAt: string;
  cliente: { nome: string };
  itens: { produto: { nome: string }; quantidade: number }[];
};

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Pedidos() {
  const { usuario, loading: authLoading } = useAuth();
  const { isVitrine } = useVitrine();
  const isDemo = (!usuario && !authLoading) || isVitrine;

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Status | "Todos">("Todos");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletePedido, setDeletePedido] = useState<Pedido | null>(null);
  const [viewPedido, setViewPedido] = useState<Pedido | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const params = new URLSearchParams({ search, page: page.toString() });
  if (filter !== "Todos") params.set("status", filter);

  const { data, isLoading: swrLoading, mutate } = useSWR(
    !isDemo ? `/api/pedidos?${params}` : null,
    fetcher, { refreshInterval: 5000 }
  );

  // In demo mode: use fake data filtered locally
  const allPedidos: Pedido[] = isDemo
    ? (demoPedidos as unknown as Pedido[]).filter(p =>
        (filter === "Todos" || p.status === filter) &&
        (search === "" || p.cliente.nome.toLowerCase().includes(search.toLowerCase()))
      )
    : (data?.pedidos || []);

  const pedidos = allPedidos;
  const total: number = isDemo ? allPedidos.length : (data?.total || 0);
  const totalPages: number = isDemo ? 1 : (data?.totalPages || 1);
  const isLoading = isDemo ? false : swrLoading;

  // Count by status from all pedidos (needs separate count — using current page data as approximation)
  const counts = allStatuses.reduce((acc, s) => {
    acc[s] = pedidos.filter(p => p.status === s).length;
    return acc;
  }, {} as Record<Status, number>);

  const handleStatusChange = async (id: number, status: Status) => {
    if (isDemo) { toast("🔒 Faça login para alterar status reais.", { icon: "🎭" }); return; }
    setUpdatingId(id);
    await fetch(`/api/pedidos/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    mutate();
    setUpdatingId(null);
  };

  const handleDelete = async (id: number) => {
    if (isDemo) { toast("🔒 Faça login para excluir pedidos reais.", { icon: "🎭" }); setDeletePedido(null); return; }
    await fetch(`/api/pedidos/${id}`, { method: "DELETE" });
    mutate();
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-4">
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Pedidos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Acompanhe todos os pedidos</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Novo Pedido
        </button>
      </div>

      {/* Status KPIs — clickable filters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {allStatuses.map(status => {
          const cfg = statusConfig[status];
          const Icon = cfg.icon;
          return (
            <div key={status} onClick={() => setFilter(filter === status ? "Todos" : status)}
              className={`rounded-xl border bg-card p-5 cursor-pointer transition-colors ${filter === status ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/30"}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">{status}</p>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.bg} ${cfg.border} border`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{counts[status]}</p>
              <p className="text-xs text-muted-foreground mt-1">pedidos nesta página</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input type="text" placeholder="Buscar pedido ou cliente..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-ring/20 w-full sm:w-[280px]" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(["Todos", ...allStatuses] as (Status | "Todos")[]).map(f => (
              <button key={f} onClick={() => { setFilter(f); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-40"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-5 font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Cliente</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground hidden md:table-cell">Data</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground hidden lg:table-cell">Itens</th>
                  <th className="text-center py-3 px-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-3 font-medium text-muted-foreground">Valor</th>
                  <th className="text-right py-3 px-5 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => {
                  const cfg = statusConfig[p.status];
                  const idx = allStatuses.indexOf(p.status);
                  return (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                      <td className="py-3.5 px-5 font-mono font-semibold text-primary">#{p.id}</td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                            {p.cliente.nome.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-foreground">{p.cliente.nome}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-muted-foreground hidden md:table-cell">
                        {new Date(p.createdAt).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-3.5 px-3 text-muted-foreground hidden lg:table-cell max-w-[200px] truncate">
                        {p.itens.map(i => `${i.produto.nome} x${i.quantidade}`).join(", ")}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <select value={p.status} disabled={updatingId === p.id}
                          onChange={(e) => handleStatusChange(p.id, e.target.value as Status)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border cursor-pointer bg-transparent ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                          {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="py-3.5 px-3 text-right font-semibold text-foreground">{formatCurrency(p.total)}</td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setViewPedido(p)}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Ver detalhes">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setViewPedido(p)}
                            className="p-1.5 rounded-lg hover:bg-amber-500/10 text-muted-foreground hover:text-amber-500 transition-colors" title="Editar status">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeletePedido(p)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors" title="Excluir">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {pedidos.length === 0 && !isLoading && (
                  <tr><td colSpan={7} className="py-12 text-center text-muted-foreground text-sm">Nenhum pedido encontrado</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">{total} pedido{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40">Anterior</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`px-3 py-1.5 text-xs rounded-lg ${page === p ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted"}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40">Próximo</button>
          </div>
        </div>
      </div>

      {modalOpen && <PedidoModal onClose={() => setModalOpen(false)} onSave={() => mutate()} />}
      {deletePedido && (
        <ConfirmDelete
          title="Excluir pedido"
          description={`Excluir pedido #${deletePedido.id} de ${deletePedido.cliente.nome}?`}
          onClose={() => setDeletePedido(null)}
          onConfirm={() => handleDelete(deletePedido.id)}
        />
      )}

      {/* View Detail Modal */}
      {viewPedido && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl mx-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-xs font-mono font-bold text-primary">#{viewPedido.id}</span>
                <h2 className="text-base font-semibold text-foreground mt-0.5">Detalhes do Pedido</h2>
              </div>
              <button onClick={() => setViewPedido(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {viewPedido.cliente.nome.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{viewPedido.cliente.nome}</p>
                  <p className="text-xs text-muted-foreground">{new Date(viewPedido.createdAt).toLocaleString('pt-BR')}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${statusConfig[viewPedido.status].color} ${statusConfig[viewPedido.status].bg} ${statusConfig[viewPedido.status].border}`}>
                  {viewPedido.status}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Itens do pedido</p>
                <div className="space-y-1.5">
                  {viewPedido.itens.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/50">
                      <span className="text-[13px] text-foreground">{item.produto.nome}</span>
                      <span className="text-[11px] text-muted-foreground font-medium">x{item.quantidade}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
                <span className="text-sm text-muted-foreground">Total do pedido</span>
                <span className="text-lg font-bold text-foreground">{formatCurrency(viewPedido.total)}</span>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Alterar status</p>
                <select value={viewPedido.status}
                  onChange={(e) => { handleStatusChange(viewPedido.id, e.target.value as Status); setViewPedido({...viewPedido, status: e.target.value as Status}); }}
                  className={`w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary/30 text-foreground transition-all`}>
                  {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <button onClick={() => setViewPedido(null)}
              className="mt-5 w-full border border-border rounded-lg py-2.5 text-sm font-medium hover:bg-muted transition-colors">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
