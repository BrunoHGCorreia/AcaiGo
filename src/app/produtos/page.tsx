"use client";
import { useState } from "react";
import useSWR from "swr";
import { Plus, Search, Edit2, Trash2, Package, Loader2 } from "lucide-react";
import ProdutoModal from "@/components/modals/ProdutoModal";
import ConfirmDelete from "@/components/modals/ConfirmDelete";

const fetcher = (url: string) => fetch(url).then(r => r.json());

type Produto = {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  custo: number;
  estoque: number;
  status: string;
  vendas: number;
};

export default function Produtos() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduto, setEditProduto] = useState<Produto | null>(null);
  const [deleteProduto, setDeleteProduto] = useState<Produto | null>(null);

  const params = new URLSearchParams({ search });
  if (filter !== "Todos" && !["Açaí", "Combo", "Adicional"].includes(filter)) params.set("status", filter);
  else if (["Açaí", "Combo", "Adicional"].includes(filter)) params.set("categoria", filter);

  const { data, isLoading, mutate } = useSWR(`/api/produtos?${params}`, fetcher, { refreshInterval: 5000 });
  const produtos: Produto[] = data?.produtos || [];

  const handleDelete = async (id: number) => {
    await fetch(`/api/produtos/${id}`, { method: "DELETE" });
    mutate();
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Produtos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Catálogo e controle de estoque</p>
        </div>
        <button onClick={() => { setEditProduto(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Novo Produto
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total de Produtos", value: produtos.length, sub: "no catálogo" },
          { label: "Ativos", value: produtos.filter(p => p.status === "Ativo").length, sub: "em venda" },
          { label: "Estoque Baixo", value: produtos.filter(p => p.status === "Baixo").length, sub: "precisam reposição", alert: true },
          { label: "Esgotados", value: produtos.filter(p => p.status === "Esgotado").length, sub: "fora de estoque", alert: true },
        ].map((kpi, i) => (
          <div key={i} className={`rounded-xl border bg-card p-5 ${kpi.alert ? "border-amber-500/20" : "border-border"}`}>
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <p className={`text-3xl font-bold mt-2 ${kpi.alert ? "text-amber-500" : "text-foreground"}`}>{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Buscar produto..."
              className="pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-ring/20 w-[240px]" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {["Todos", "Açaí", "Combo", "Adicional", "Baixo", "Esgotado"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
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
                  {["Produto", "Categoria", "Preço Venda", "Custo", "Margem", "Estoque", "Vendas", "Status", "Ações"].map(h => (
                    <th key={h} className="text-left py-3 px-4 font-medium text-muted-foreground first:px-5 last:px-5 last:text-right">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {produtos.map((p) => {
                  const margem = Math.round(((p.preco - p.custo) / p.preco) * 100);
                  return (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                            <Package className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{p.nome}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{p.categoria}</td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">R$ {p.preco.toFixed(2).replace(".", ",")}</td>
                      <td className="py-3.5 px-4 text-muted-foreground">R$ {p.custo.toFixed(2).replace(".", ",")}</td>
                      <td className="py-3.5 px-4">
                        <span className={`text-xs font-semibold ${margem >= 50 ? "text-emerald-500" : margem >= 30 ? "text-amber-500" : "text-red-500"}`}>{margem}%</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`font-semibold ${p.estoque === 0 ? "text-red-500" : p.estoque < 15 ? "text-amber-500" : "text-foreground"}`}>{p.estoque}</span>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{p.vendas}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${p.status === "Ativo" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : p.status === "Baixo" ? "text-amber-500 bg-amber-500/10 border-amber-500/20" : "text-red-500 bg-red-500/10 border-red-500/20"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditProduto(p); setModalOpen(true); }}
                            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteProduto(p)}
                            className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {produtos.length === 0 && !isLoading && (
                  <tr><td colSpan={9} className="py-12 text-center text-muted-foreground text-sm">Nenhum produto encontrado</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <ProdutoModal produto={editProduto} onClose={() => { setModalOpen(false); setEditProduto(null); }} onSave={() => mutate()} />
      )}
      {deleteProduto && (
        <ConfirmDelete
          title="Excluir produto"
          description={`Excluir "${deleteProduto.nome}" do catálogo?`}
          onClose={() => setDeleteProduto(null)}
          onConfirm={() => handleDelete(deleteProduto.id)}
        />
      )}
    </div>
  );
}
