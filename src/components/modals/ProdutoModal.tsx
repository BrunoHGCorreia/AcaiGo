"use client";
import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";

interface ProdutoModalProps {
  onClose: () => void;
  onSave: () => void;
  produto?: { id: number; nome: string; categoria: string; preco: number; custo: number; estoque: number; status: string; } | null;
}

export default function ProdutoModal({ onClose, onSave, produto }: ProdutoModalProps) {
  const isEdit = !!produto;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nome: produto?.nome || "",
    categoria: produto?.categoria || "Açaí",
    preco: produto?.preco?.toString() || "",
    custo: produto?.custo?.toString() || "",
    estoque: produto?.estoque?.toString() || "0",
  });

  const margem = form.preco && form.custo
    ? Math.round(((parseFloat(form.preco) - parseFloat(form.custo)) / parseFloat(form.preco)) * 100)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = { nome: form.nome, categoria: form.categoria, preco: parseFloat(form.preco), custo: parseFloat(form.custo), estoque: parseInt(form.estoque), status: "Ativo" };
    try {
      const url = isEdit ? `/api/produtos/${produto.id}` : "/api/produtos";
      const res = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Erro ao salvar"); return; }
      onSave(); onClose();
    } catch { setError("Erro de conexão"); } finally { setLoading(false); }
  };

  const inputClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary/30 text-foreground";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6 z-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">{isEdit ? "Editar Produto" : "Novo Produto"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-xs font-medium text-muted-foreground mb-1.5">Nome *</label>
            <input type="text" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Açaí 500ml" className={inputClass} /></div>
          <div><label className="block text-xs font-medium text-muted-foreground mb-1.5">Categoria *</label>
            <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className={inputClass + " cursor-pointer"}>
              <option>Açaí</option><option>Combo</option><option>Adicional</option>
            </select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-muted-foreground mb-1.5">Preço (R$) *</label>
              <input type="number" step="0.01" min="0" required value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} placeholder="0.00" className={inputClass} /></div>
            <div><label className="block text-xs font-medium text-muted-foreground mb-1.5">Custo (R$) *</label>
              <input type="number" step="0.01" min="0" required value={form.custo} onChange={(e) => setForm({ ...form, custo: e.target.value })} placeholder="0.00" className={inputClass} /></div>
          </div>
          {margem !== null && (
            <div className="p-2.5 rounded-lg bg-muted/50 text-xs flex items-center justify-between">
              <span className="text-muted-foreground">Margem de lucro</span>
              <span className={`font-bold ${margem >= 50 ? "text-emerald-500" : margem >= 30 ? "text-amber-500" : "text-red-500"}`}>{margem}%</span>
            </div>
          )}
          <div><label className="block text-xs font-medium text-muted-foreground mb-1.5">Estoque *</label>
            <input type="number" min="0" required value={form.estoque} onChange={(e) => setForm({ ...form, estoque: e.target.value })} className={inputClass} /></div>
          {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? "Salvando..." : isEdit ? "Atualizar" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
