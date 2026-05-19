"use client";
import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { formatPhone } from "@/lib/utils";

interface ClienteModalProps {
  onClose: () => void;
  onSave: () => void;
  cliente?: {
    id: number;
    nome: string;
    email: string;
    telefone?: string;
    status: string;
  } | null;
}

export default function ClienteModal({ onClose, onSave, cliente }: ClienteModalProps) {
  const isEdit = !!cliente;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nome: cliente?.nome || "",
    email: cliente?.email || "",
    telefone: cliente?.telefone || "",
    status: cliente?.status || "Ativo",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEdit ? `/api/clientes/${cliente.id}` : "/api/clientes";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao salvar cliente");
        return;
      }

      onSave();
      onClose();
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl shadow-black/40 p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">
            {isEdit ? "Editar Cliente" : "Novo Cliente"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nome completo *</label>
            <input
              type="text"
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Ex: João Silva"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="joao@email.com"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Telefone</label>
            <input
              type="tel"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: formatPhone(e.target.value) })}
              placeholder="(11) 99999-0000"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground transition-all cursor-pointer"
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? "Salvando..." : isEdit ? "Atualizar" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
