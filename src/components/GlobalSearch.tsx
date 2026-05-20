"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Users, Package, ShoppingBag, Target, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { clientesData, pedidosData, produtosData, leadsData } from "@/lib/data";
import { usePermissions } from "@/hooks/usePermissions";
import type { Permission } from "@/lib/permissions";

type Result = {
  type: "cliente" | "pedido" | "produto" | "lead";
  label: string;
  sub: string;
  href: string;
  initials?: string;
};

const iconMap = {
  cliente: Users,
  pedido: Package,
  produto: ShoppingBag,
  lead: Target,
};

const colorMap = {
  cliente: "text-violet-500 bg-violet-500/10",
  pedido: "text-blue-500 bg-blue-500/10",
  produto: "text-amber-500 bg-amber-500/10",
  lead: "text-emerald-500 bg-emerald-500/10",
};

const labelMap = {
  cliente: "Cliente",
  pedido: "Pedido",
  produto: "Produto",
  lead: "Lead",
};

// Map search categories to required permissions
const categoryPermissions: Record<Result["type"], Permission> = {
  cliente: "clientes:view",
  pedido: "pedidos:view",
  produto: "produtos:view",
  lead: "leads:view",
};

function searchAll(query: string, can: (p: Permission) => boolean): Result[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: Result[] = [];

  if (can("clientes:view")) {
    const clientes: Result[] = clientesData
      .filter(c => c.nome.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
      .slice(0, 3)
      .map(c => ({ type: "cliente", label: c.nome, sub: c.email, href: "/clientes", initials: c.initials }));
    results.push(...clientes);
  }

  if (can("pedidos:view")) {
    const pedidos: Result[] = pedidosData
      .filter(p => p.id.includes(q) || p.cliente.toLowerCase().includes(q) || p.itens.toLowerCase().includes(q))
      .slice(0, 3)
      .map(p => ({ type: "pedido", label: `Pedido ${p.id}`, sub: `${p.cliente} · ${p.valor} · ${p.status}`, href: "/pedidos" }));
    results.push(...pedidos);
  }

  if (can("produtos:view")) {
    const produtos: Result[] = produtosData
      .filter(p => p.nome.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q))
      .slice(0, 3)
      .map(p => ({ type: "produto", label: p.nome, sub: `${p.cat} · ${p.preco} · Estoque: ${p.estoque}`, href: "/produtos" }));
    results.push(...produtos);
  }

  if (can("leads:view")) {
    const leads: Result[] = leadsData
      .filter(l => l.nome.toLowerCase().includes(q) || l.fonte.toLowerCase().includes(q))
      .slice(0, 2)
      .map(l => ({ type: "lead", label: l.nome, sub: `${l.fonte} · ${l.stage} · ${l.valor}`, href: "/leads", initials: l.initials }));
    results.push(...leads);
  }

  return results;
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { can, isLoading } = usePermissions();

  useEffect(() => {
    if (isLoading) return;
    const r = searchAll(query, can);
    setResults(r);
    setSelected(0);
    setOpen(query.trim().length > 0);
  }, [query, can, isLoading]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && results[selected]) {
      router.push(results[selected].href);
      setQuery("");
      setOpen(false);
    }
  };

  const handleSelect = (result: Result) => {
    router.push(result.href);
    setQuery("");
    setOpen(false);
  };

  // Determine visible categories based on permissions
  const visibleTypes = (["cliente", "pedido", "produto", "lead"] as const).filter(
    type => !isLoading && can(categoryPermissions[type])
  );

  const placeholderText = isLoading
    ? "Buscando..."
    : visibleTypes.length === 0
    ? "Sem acesso à busca"
    : `Buscar ${visibleTypes.includes("cliente") ? "clientes, " : ""}${visibleTypes.includes("pedido") ? "pedidos" : ""}...`;

  return (
    <div className="relative hidden md:block">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder={placeholderText}
          disabled={isLoading || visibleTypes.length === 0}
          className="w-[280px] h-9 pl-9 pr-10 rounded-lg bg-background border border-border text-sm outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/20 text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button onClick={() => { setQuery(""); setOpen(false); }} className="text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-[400px] rounded-xl border border-border bg-card shadow-2xl shadow-black/30 z-50 overflow-hidden">
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                <p className="text-sm text-muted-foreground">Nenhum resultado para <span className="font-semibold text-foreground">"{query}"</span></p>
              </div>
            ) : (
              <div className="py-2">
                {(["cliente", "pedido", "produto", "lead"] as const).map(type => {
                  // Skip categories the user doesn't have access to
                  if (!can(categoryPermissions[type])) return null;
                  const group = results.filter(r => r.type === type);
                  if (!group.length) return null;
                  const Icon = iconMap[type];
                  return (
                    <div key={type}>
                      <div className="px-3 pt-2 pb-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{labelMap[type]}s</p>
                      </div>
                      {group.map((r, i) => {
                        const globalIdx = results.indexOf(r);
                        return (
                          <button
                            key={i}
                            onClick={() => handleSelect(r)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${globalIdx === selected ? "bg-primary/10" : "hover:bg-muted/60"}`}
                          >
                            {r.initials ? (
                              <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                                {r.initials}
                              </div>
                            ) : (
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[r.type]}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-medium text-foreground truncate">{r.label}</p>
                              <p className="text-[11px] text-muted-foreground truncate">{r.sub}</p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
                <div className="border-t border-border px-3 py-2 flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground">{results.length} resultado{results.length !== 1 ? "s" : ""}</p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="border border-border rounded px-1">↑↓</span> navegar
                    <span className="border border-border rounded px-1">↵</span> abrir
                    <span className="border border-border rounded px-1">Esc</span> fechar
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
