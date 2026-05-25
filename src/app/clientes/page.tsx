"use client";
import { useState } from "react";
import useSWR from "swr";
import { Search, Plus, Eye, Edit2, Trash2, ArrowUpRight, ArrowDownRight, Users, ShoppingBag, Star, Phone, Loader2, X } from "lucide-react";
import ClienteModal from "@/components/modals/ClienteModal";
import ConfirmDelete from "@/components/modals/ConfirmDelete";
import { useAuth } from "@/contexts/AuthContext";
import { useVitrine } from "@/contexts/VitrineContext";
import { demoClientes } from "@/lib/demo-data";
import toast from "react-hot-toast";

const fetcher = (url: string) => fetch(url).then(r => r.json());

type Cliente = {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  status: string;
  createdAt: string;
  _count: { pedidos: number };
};

function getInitials(nome: string) {
  return nome.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

export default function Clientes() {
  const { usuario, loading: authLoading } = useAuth();
  const { isVitrine } = useVitrine();
  const isDemo = (!usuario && !authLoading) || isVitrine;

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCliente, setEditCliente] = useState<Cliente | null>(null);
  const [deleteCliente, setDeleteCliente] = useState<Cliente | null>(null);
  const [viewCliente, setViewCliente] = useState<Cliente | null>(null);

  const params = new URLSearchParams({ search, page: page.toString() });
  if (filter !== "Todos") params.set("status", filter);

  const { data, isLoading: swrLoading, mutate } = useSWR(
    !isDemo ? `/api/clientes?${params}` : null,
    fetcher, { refreshInterval: 5000 }
  );

  const allClientes: Cliente[] = isDemo
    ? (demoClientes as unknown as Cliente[]).filter(c =>
        (filter === "Todos" || c.status === filter) &&
        (search === "" || c.nome.toLowerCase().includes(search.toLowerCase()))
      )
    : (data?.clientes || []);

  const clientes = allClientes;
  const total: number = isDemo ? allClientes.length : (data?.total || 0);
  const totalPages: number = isDemo ? 1 : (data?.totalPages || 1);
  const isLoading = isDemo ? false : swrLoading;
  const ativos = clientes.filter(c => c.status === "Ativo").length;

  const handleDelete = async (id: number) => {
    if (isDemo) { toast("🔒 Faça login para excluir clientes reais.", { icon: "🎭" }); setDeleteCliente(null); return; }
    await fetch(`/api/clientes/${id}`, { method: "DELETE" });
    mutate();
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-4">
      {/* Header */}
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie sua base de clientes</p>
        </div>
        <button
          onClick={() => { setEditCliente(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Novo Cliente
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total de Clientes", value: total, delta: "+3 este mês", positive: true, icon: Users, color: "text-violet-500 bg-violet-500/10" },
          { label: "Clientes Ativos", value: ativos, delta: `${total > 0 ? Math.round((ativos / Math.max(clientes.length, 1)) * 100) : 0}% da página`, positive: true, icon: Star, color: "text-emerald-500 bg-emerald-500/10" },
          { label: "Pedidos este Mês", value: clientes.reduce((s, c) => s + (c._count?.pedidos || 0), 0), delta: "total no banco", positive: true, icon: ShoppingBag, color: "text-blue-500 bg-blue-500/10" },
          { label: "Ticket Médio", value: "R$ 31,52", delta: "-3,8% vs anterior", positive: false, icon: Phone, color: "text-amber-500 bg-amber-500/10" },
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

      {/* Table Card */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input type="text" placeholder="Buscar cliente..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-ring/20 w-full sm:w-[260px]" />
          </div>
          <div className="flex items-center gap-2">
            {["Todos", "Ativo", "Inativo"].map(f => (
              <button key={f} onClick={() => { setFilter(f); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-5 font-medium text-muted-foreground">Cliente</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground hidden md:table-cell">Contato</th>
                  <th className="text-center py-3 px-3 font-medium text-muted-foreground">Pedidos</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground hidden lg:table-cell">Cadastro</th>
                  <th className="text-center py-3 px-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-5 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[11px] font-bold text-primary flex-shrink-0">
                          {getInitials(c.nome)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{c.nome}</p>
                          <p className="text-[11px] text-muted-foreground">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-muted-foreground hidden md:table-cell">{c.telefone || "—"}</td>
                    <td className="py-3.5 px-3 text-center font-semibold text-foreground">{c._count?.pedidos || 0}</td>
                    <td className="py-3.5 px-3 text-muted-foreground hidden lg:table-cell">
                      {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${c.status === "Ativo" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-slate-400 bg-slate-500/10 border-slate-500/20"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setViewCliente(c)}
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Ver detalhes">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { setEditCliente(c); setModalOpen(true); }}
                          className="p-1.5 rounded-lg hover:bg-amber-500/10 text-muted-foreground hover:text-amber-500 transition-colors" title="Editar">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteCliente(c)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors" title="Excluir">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {clientes.length === 0 && !isLoading && (
                  <tr><td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">Nenhum cliente encontrado</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">{total} cliente{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40">Anterior</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`px-3 py-1.5 text-xs rounded-lg ${page === p ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40">Próximo</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modalOpen && (
        <ClienteModal
          cliente={editCliente}
          onClose={() => { setModalOpen(false); setEditCliente(null); }}
          onSave={() => mutate()}
        />
      )}
      {deleteCliente && (
        <ConfirmDelete
          title="Excluir cliente"
          description={`Tem certeza que deseja excluir ${deleteCliente.nome}? Esta ação não pode ser desfeita.`}
          onClose={() => setDeleteCliente(null)}
          onConfirm={() => handleDelete(deleteCliente.id)}
        />
      )}

      {/* View Cliente Modal */}
      {viewCliente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl mx-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-foreground">Detalhes do Cliente</h2>
              <button onClick={() => setViewCliente(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                  {getInitials(viewCliente.nome)}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{viewCliente.nome}</p>
                  <p className="text-xs text-muted-foreground">{viewCliente.email}</p>
                </div>
              </div>
              {[
                { label: 'Telefone', value: viewCliente.telefone || '—' },
                { label: 'Pedidos', value: viewCliente._count?.pedidos ?? 0 },
                { label: 'Cadastro', value: new Date(viewCliente.createdAt).toLocaleDateString('pt-BR') },
                { label: 'Status', value: viewCliente.status },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-xs text-muted-foreground">{row.label}</span>
                  <span className="text-sm font-medium text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setViewCliente(null)}
                className="flex-1 border border-border rounded-lg py-2.5 text-sm font-medium hover:bg-muted transition-colors">Fechar</button>
              <button onClick={() => { setViewCliente(null); setEditCliente(viewCliente); setModalOpen(true); }}
                className="flex-1 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">Editar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
