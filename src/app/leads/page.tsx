"use client";
import { useState } from "react";
import useSWR from "swr";
import { Plus, ArrowUpRight, Target, Clock, CheckCircle, Loader2, Trash2, X, Save } from "lucide-react";
import ConfirmDelete from "@/components/modals/ConfirmDelete";
import { formatPhone } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then(r => r.json());

type Stage = "Novo" | "Contato" | "Proposta" | "Fechado";

const stageConfig: Record<Stage, { label: string; color: string; bg: string; border: string; icon: any }> = {
  "Novo":     { label: "Novo", color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", icon: Target },
  "Contato":  { label: "Contato", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Clock },
  "Proposta": { label: "Proposta", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: ArrowUpRight },
  "Fechado":  { label: "Fechado", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle },
};
const stages: Stage[] = ["Novo", "Contato", "Proposta", "Fechado"];

type Lead = { id: number; nome: string; contato: string; fonte: string; valorEst?: number; stage: Stage; createdAt: string; };

function NovoLeadModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({ nome: "", contato: "", fonte: "Instagram", valorEst: "", stage: "Novo" as Stage });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, valorEst: form.valorEst ? parseFloat(form.valorEst) : undefined }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Erro"); return; }
      onSave(); onClose();
    } catch { setError("Erro de conexão"); } finally { setLoading(false); }
  };

  const inputClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary/30 text-foreground";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6 z-10" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Novo Lead</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-xs font-medium text-muted-foreground mb-1.5">Nome *</label>
            <input type="text" required value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className={inputClass} placeholder="Nome do lead" /></div>
          <div><label className="block text-xs font-medium text-muted-foreground mb-1.5">Contato *</label>
            <input type="text" required value={form.contato} onChange={e => setForm({ ...form, contato: formatPhone(e.target.value) })} className={inputClass} placeholder="(11) 99999-0000" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-muted-foreground mb-1.5">Fonte *</label>
              <select value={form.fonte} onChange={e => setForm({ ...form, fonte: e.target.value })} className={inputClass + " cursor-pointer"}>
                <option>Instagram</option><option>Google</option><option>Indicação</option><option>Site</option><option>Outro</option>
              </select></div>
            <div><label className="block text-xs font-medium text-muted-foreground mb-1.5">Valor Est. (R$)</label>
              <input type="number" step="0.01" value={form.valorEst} onChange={e => setForm({ ...form, valorEst: e.target.value })} className={inputClass} placeholder="0,00" /></div>
          </div>
          {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? "Salvando..." : "Criar Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Leads() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteLead, setDeleteLead] = useState<Lead | null>(null);

  const { data, isLoading, mutate } = useSWR("/api/leads", fetcher, { refreshInterval: 5000 });
  const leads: Lead[] = data?.leads || [];

  const moveStage = async (id: number, direction: "forward" | "back") => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    const idx = stages.indexOf(lead.stage);
    const newStage = stages[direction === "forward" ? Math.min(idx + 1, 3) : Math.max(idx - 1, 0)];
    await fetch(`/api/leads/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stage: newStage }) });
    mutate();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    mutate();
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-4">
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Pipeline de captação de clientes</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Novo Lead
        </button>
      </div>

      {/* Stage summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map(stage => {
          const cfg = stageConfig[stage];
          const count = leads.filter(l => l.stage === stage).length;
          return (
            <div key={stage} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className={`text-xs font-semibold uppercase tracking-wider ${cfg.color}`}>{stage}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>{count}</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{count}</p>
              <p className="text-xs text-muted-foreground mt-1">leads nesta etapa</p>
            </div>
          );
        })}
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {stages.map(stage => {
            const cfg = stageConfig[stage];
            const stageLeads = leads.filter(l => l.stage === stage);
            return (
              <div key={stage} className="rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${cfg.color.replace("text-", "bg-")}`} />
                    <span className="text-sm font-semibold text-foreground">{stage}</span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">{stageLeads.length}</span>
                </div>
                <div className="p-3 space-y-3 min-h-[200px]">
                  {stageLeads.map(lead => (
                    <div key={lead.id} className="rounded-lg border border-border bg-background p-3.5 hover:border-primary/30 transition-colors group/card">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                          {lead.nome.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-foreground leading-none truncate">{lead.nome}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{lead.contato}</p>
                        </div>
                        <button onClick={() => setDeleteLead(lead)} className="opacity-100 lg:opacity-0 lg:group-hover/card:opacity-100 p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">{lead.fonte}</span>
                        <span className="font-semibold text-primary">{lead.valorEst ? `R$ ${lead.valorEst.toFixed(2).replace(".", ",")}/mês` : "—"}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-border">
                        <span className="text-[10px] text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString("pt-BR")}</span>
                        <div className="flex gap-1">
                          {stages.indexOf(lead.stage) > 0 && (
                            <button onClick={() => moveStage(lead.id, "back")} className="px-2 py-0.5 text-[10px] border border-border rounded text-muted-foreground hover:bg-muted transition-colors">←</button>
                          )}
                          {stages.indexOf(lead.stage) < 3 && (
                            <button onClick={() => moveStage(lead.id, "forward")} className="px-2 py-0.5 text-[10px] bg-primary/10 border border-primary/20 rounded text-primary hover:bg-primary/20 transition-colors">→</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">Nenhum lead aqui</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && <NovoLeadModal onClose={() => setModalOpen(false)} onSave={() => mutate()} />}
      {deleteLead && (
        <ConfirmDelete
          title="Excluir lead"
          description={`Excluir o lead "${deleteLead.nome}"?`}
          onClose={() => setDeleteLead(null)}
          onConfirm={() => handleDelete(deleteLead.id)}
        />
      )}
    </div>
  );
}
