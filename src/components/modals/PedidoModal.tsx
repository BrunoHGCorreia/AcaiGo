"use client";
import { useState, useEffect } from "react";
import { X, Save, Loader2, Plus, Minus } from "lucide-react";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
  status: string;
}

interface Cliente {
  id: number;
  nome: string;
}

interface ItemForm {
  produtoId: number;
  quantidade: number;
  precoUnit: number;
  produtoNome: string;
}

interface PedidoModalProps {
  onClose: () => void;
  onSave: () => void;
}

export default function PedidoModal({ onClose, onSave }: PedidoModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clienteId, setClienteId] = useState<number | "">("");
  const [itens, setItens] = useState<ItemForm[]>([]);
  const [selectedProduto, setSelectedProduto] = useState<number | "">("");

  useEffect(() => {
    fetch("/api/clientes?limit=100").then(r => r.json()).then(d => setClientes(d.clientes || []));
    fetch("/api/produtos").then(r => r.json()).then(d => setProdutos(d.produtos?.filter((p: Produto) => p.status !== "Esgotado") || []));
  }, []);

  const addItem = () => {
    if (!selectedProduto) return;
    const produto = produtos.find(p => p.id === Number(selectedProduto));
    if (!produto) return;

    const existing = itens.find(i => i.produtoId === produto.id);
    if (existing) {
      setItens(prev => prev.map(i => i.produtoId === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i));
    } else {
      setItens(prev => [...prev, { produtoId: produto.id, quantidade: 1, precoUnit: produto.preco, produtoNome: produto.nome }]);
    }
    setSelectedProduto("");
  };

  const updateQtd = (produtoId: number, delta: number) => {
    setItens(prev => prev
      .map(i => i.produtoId === produtoId ? { ...i, quantidade: i.quantidade + delta } : i)
      .filter(i => i.quantidade > 0)
    );
  };

  const total = itens.reduce((acc, i) => acc + i.precoUnit * i.quantidade, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || itens.length === 0) {
      setError("Selecione um cliente e ao menos um produto");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteId: Number(clienteId),
          status: "Pedido",
          itens: itens.map(i => ({ produtoId: i.produtoId, quantidade: i.quantidade, precoUnit: i.precoUnit })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao criar pedido");
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
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl shadow-black/40 p-6 z-10 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Novo Pedido</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cliente */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Cliente *</label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value ? Number(e.target.value) : "")}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary/30 text-foreground cursor-pointer"
            >
              <option value="">Selecione um cliente...</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>

          {/* Adicionar produto */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Adicionar produto</label>
            <div className="flex gap-2">
              <select
                value={selectedProduto}
                onChange={(e) => setSelectedProduto(e.target.value ? Number(e.target.value) : "")}
                className="flex-1 px-3 py-2.5 text-sm rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary/30 text-foreground cursor-pointer"
              >
                <option value="">Selecionar produto...</option>
                {produtos.map(p => <option key={p.id} value={p.id}>{p.nome} — R$ {p.preco.toFixed(2).replace(".", ",")}</option>)}
              </select>
              <button
                type="button"
                onClick={addItem}
                disabled={!selectedProduto}
                className="px-3 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lista de itens */}
          {itens.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Itens do pedido</p>
              {itens.map((item) => (
                <div key={item.produtoId} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.produtoNome}</p>
                    <p className="text-xs text-muted-foreground">R$ {item.precoUnit.toFixed(2).replace(".", ",")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => updateQtd(item.produtoId, -1)} className="w-6 h-6 rounded flex items-center justify-center border border-border hover:bg-muted text-muted-foreground">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold text-foreground w-5 text-center">{item.quantidade}</span>
                    <button type="button" onClick={() => updateQtd(item.produtoId, 1)} className="w-6 h-6 rounded flex items-center justify-center border border-border hover:bg-muted text-muted-foreground">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5 border border-primary/20">
                <span className="text-sm font-semibold text-foreground">Total</span>
                <span className="text-sm font-bold text-primary">R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading || itens.length === 0 || !clienteId} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? "Salvando..." : "Criar Pedido"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
