"use client";
import { useState } from "react";
import useSWR from "swr";
import { Truck, Plus, Edit2, Trash2, CheckCircle, Clock, AlertCircle, Loader2, X, Save, Package } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";
import { usePermissions } from "@/hooks/usePermissions";
import toast from "react-hot-toast";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Entregador {
  id: number;
  nome: string;
  telefone?: string;
  placa?: string;
  veiculo?: string;
  status: string;
  despachos?: Despacho[];
}

interface Despacho {
  id: number;
  status: string;
  taxaEntrega: number;
  createdAt: string;
  pedido: { id: number; total: number; cliente: { nome: string } };
  entregador: { nome: string };
}

// ─── Status badge ──────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; icon: React.ElementType }> = {
    Ativo: { color: "text-emerald-400 bg-emerald-400/10", icon: CheckCircle },
    "Em Rota": { color: "text-amber-400 bg-amber-400/10", icon: Truck },
    Inativo: { color: "text-red-400 bg-red-400/10", icon: AlertCircle },
    Aguardando: { color: "text-sky-400 bg-sky-400/10", icon: Clock },
    Entregue: { color: "text-emerald-400 bg-emerald-400/10", icon: CheckCircle },
    Cancelado: { color: "text-red-400 bg-red-400/10", icon: AlertCircle },
  };
  const cfg = map[status] ?? { color: "text-muted-foreground bg-muted", icon: Clock };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

// ─── Modal Entregador ──────────────────────────────────────────────────────
function EntregadorModal({ onClose, onSave, entregador }: {
  onClose: () => void;
  onSave: () => void;
  entregador?: Entregador;
}) {
  const [form, setForm] = useState({
    nome: entregador?.nome ?? "",
    telefone: entregador?.telefone ?? "",
    placa: entregador?.placa ?? "",
    veiculo: entregador?.veiculo ?? "Moto",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = entregador ? `/api/entregadores/${entregador.id}` : "/api/entregadores";
      const method = entregador ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(entregador ? "Entregador atualizado!" : "Entregador criado!");
      onSave();
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">{entregador ? "Editar Entregador" : "Novo Entregador"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Nome *</label>
            <input className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Telefone</label>
              <input className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" value={form.telefone}
                onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} placeholder="(41) 99999-0000" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Placa</label>
              <input className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" value={form.placa}
                onChange={e => setForm(f => ({ ...f, placa: e.target.value }))} placeholder="ABC-1234" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Veículo</label>
            <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" value={form.veiculo}
              onChange={e => setForm(f => ({ ...f, veiculo: e.target.value }))}>
              <option>Moto</option>
              <option>Bicicleta</option>
              <option>Carro</option>
              <option>A pé</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-border rounded-lg py-2 text-sm hover:bg-muted transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function LogisticaPage() {
  const { data, mutate, isLoading } = useSWR("/api/entregadores", fetcher);
  const { data: despachos, mutate: mutateDespachos, isLoading: loadingDespachos } = useSWR("/api/despachos", fetcher);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Entregador | undefined>();
  const { can } = usePermissions();

  const entregadores: Entregador[] = data?.entregadores ?? [];
  const despachosData: Despacho[] = despachos?.despachos ?? [];

  const handleDelete = async (id: number) => {
    if (!confirm("Remover este entregador?")) return;
    try {
      await fetch(`/api/entregadores/${id}`, { method: "DELETE" });
      toast.success("Entregador removido");
      mutate();
    } catch {
      toast.error("Erro ao remover");
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await fetch(`/api/entregadores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      toast.success("Status atualizado");
      mutate();
    } catch {
      toast.error("Erro ao atualizar");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Logística</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Gerenciamento de entregadores e despachos</p>
        </div>
        <RoleGuard permission="logistica:manage">
          <button
            onClick={() => { setEditing(undefined); setShowModal(true); }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Novo Entregador
          </button>
        </RoleGuard>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Ativos", value: entregadores.filter(e => e.status === "Ativo").length, color: "text-emerald-400" },
          { label: "Em Rota", value: entregadores.filter(e => e.status === "Em Rota").length, color: "text-amber-400" },
          { label: "Inativos", value: entregadores.filter(e => e.status === "Inativo").length, color: "text-red-400" },
          { label: "Despachos Hoje", value: despachosData.filter(d => {
            const today = new Date().toDateString();
            return new Date(d.createdAt).toDateString() === today;
          }).length, color: "text-sky-400" },
        ].map(card => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-muted-foreground text-xs">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Entregadores Grid */}
      <div>
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4 text-primary" /> Entregadores
        </h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : entregadores.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-xl">
            <Truck className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhum entregador cadastrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entregadores.map(e => (
              <div key={e.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{e.nome}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{e.veiculo} {e.placa ? `• ${e.placa}` : ""}</p>
                    {e.telefone && <p className="text-muted-foreground text-xs">{e.telefone}</p>}
                  </div>
                  <StatusBadge status={e.status} />
                </div>
                <div className="flex items-center gap-2">
                  <RoleGuard permission="logistica:manage">
                    <select
                      value={e.status}
                      onChange={ev => handleStatusChange(e.id, ev.target.value)}
                      className="flex-1 bg-background border border-border rounded-lg px-2 py-1 text-xs"
                    >
                      <option>Ativo</option>
                      <option>Em Rota</option>
                      <option>Inativo</option>
                    </select>
                    <button onClick={() => { setEditing(e); setShowModal(true); }}
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(e.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </RoleGuard>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Despachos */}
      <div>
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" /> Despachos Recentes
        </h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {loadingDespachos ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : despachosData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Nenhum despacho registrado</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Pedido</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Cliente</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Entregador</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Taxa</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {despachosData.slice(0, 20).map(d => (
                  <tr key={d.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{d.pedido.id}</td>
                    <td className="px-4 py-3">{d.pedido.cliente.nome}</td>
                    <td className="px-4 py-3">{d.entregador.nome}</td>
                    <td className="px-4 py-3 text-emerald-400">R$ {Number(d.taxaEntrega).toFixed(2)}</td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <EntregadorModal
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); mutate(); mutateDespachos(); }}
          entregador={editing}
        />
      )}
    </div>
  );
}
