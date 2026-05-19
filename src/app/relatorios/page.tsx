"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Download, FileText, BarChart2, Users, DollarSign, ShoppingBag, Loader2 } from "lucide-react";

const reportTypes = [
  { icon: DollarSign, title: "Relatório de Faturamento", desc: "Receitas, despesas e lucro por período", color: "text-violet-500 bg-violet-500/10", period: "Maio 2026" },
  { icon: ShoppingBag, title: "Relatório de Pedidos", desc: "Quantidade, status e ticket médio", color: "text-blue-500 bg-blue-500/10", period: "Maio 2026" },
  { icon: Users, title: "Relatório de Clientes", desc: "Base de clientes, retenção e churn", color: "text-emerald-500 bg-emerald-500/10", period: "Maio 2026" },
  { icon: BarChart2, title: "Relatório de Produtos", desc: "Top vendas, margens e estoque", color: "text-amber-500 bg-amber-500/10", period: "Maio 2026" },
];

const historicoRelatorios = [
  { nome: "Faturamento Abril 2026", tipo: "Financeiro", gerado: "01/05/2026", tamanho: "245 KB" },
  { nome: "Pedidos Abril 2026", tipo: "Pedidos", gerado: "01/05/2026", tamanho: "182 KB" },
  { nome: "Clientes Q1 2026", tipo: "Clientes", gerado: "01/04/2026", tamanho: "310 KB" },
  { nome: "Produtos Março 2026", tipo: "Produtos", gerado: "01/04/2026", tamanho: "198 KB" },
  { nome: "Faturamento Março 2026", tipo: "Financeiro", gerado: "01/04/2026", tamanho: "267 KB" },
];

const resumo = [
  { label: "Faturamento Maio", value: "R$ 28.300,00", sub: "+15,1% vs Abril" },
  { label: "Total de Pedidos", value: "476", sub: "+8,2% vs Abril" },
  { label: "Clientes Ativos", value: "312", sub: "+12 novos clientes" },
  { label: "Produto mais vendido", value: "Açaí 500ml", sub: "142 unidades em Maio" },
];

export default function Relatorios() {
  const [generatingId, setGeneratingId] = useState<number | null>(null);

  const handleGerar = async (idx: number, title: string) => {
    setGeneratingId(idx);
    await new Promise(r => setTimeout(r, 1800));
    setGeneratingId(null);
    toast.success(`${title} gerado com sucesso!`);
  };

  const handleDownload = (nome: string) => {
    toast.success(`Download de "${nome}" iniciado!`);
  };
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Gere e exporte relatórios do seu negócio</p>
      </div>

      {/* Quick summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {resumo.map((r, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{r.label}</p>
            <p className="text-xl font-bold text-foreground mt-2">{r.value}</p>
            <p className="text-xs text-emerald-500 mt-1">{r.sub}</p>
          </div>
        ))}
      </div>

      {/* Generate reports */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Gerar Novo Relatório</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((r, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors cursor-pointer group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${r.color} group-hover:scale-110 transition-transform`}>
                <r.icon className="w-5 h-5" />
              </div>
              <h3 className="text-[13px] font-semibold text-foreground mb-1">{r.title}</h3>
              <p className="text-xs text-muted-foreground mb-4">{r.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground border border-border px-2 py-0.5 rounded-full">{r.period}</span>
                <button
                  onClick={() => handleGerar(i, r.title)}
                  disabled={generatingId === i}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-60"
                >
                  {generatingId === i ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  {generatingId === i ? "Gerando..." : "Gerar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Histórico de Relatórios</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] min-w-[480px]">
            <thead>
              <tr className="border-b border-border">
                {["Nome", "Tipo", "Gerado em", "Tamanho", ""].map((h, i) => (
                  <th key={i} className={`py-3 px-5 font-medium text-muted-foreground ${i === 4 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historicoRelatorios.map((r, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium text-foreground">{r.nome}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">{r.tipo}</span>
                  </td>
                  <td className="py-3.5 px-5 text-muted-foreground">{r.gerado}</td>
                  <td className="py-3.5 px-5 text-muted-foreground">{r.tamanho}</td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => handleDownload(r.nome)}
                      className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 ml-auto opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
