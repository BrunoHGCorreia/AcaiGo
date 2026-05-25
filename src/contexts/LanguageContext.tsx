"use client";
import { createContext, useContext, useState, useCallback, useEffect } from "react";

export type Lang = "pt" | "en" | "es";

const translations = {
  pt: {
    // ── Dashboard KPIs ──────────────────────────────────
    "kpi.faturamentoHoje":  "Faturamento Hoje",
    "kpi.pedidosHoje":      "Pedidos Hoje",
    "kpi.novosClientes":    "Novos Clientes",
    "kpi.ticketMedio":      "Ticket Médio",
    "kpi.vsOntem":          "vs ontem",
    // ── Dashboard sections ───────────────────────────────
    "dash.faturamentoDia":    "Faturamento do Dia",
    "dash.comparadoOntem":    "+21,3% comparado a ontem",
    "dash.statusPedidos":     "Status dos Pedidos",
    "dash.hoje":              "Hoje",
    "dash.pedidosRecentes":   "Pedidos Recentes",
    "dash.ultimosPedidos":    "Últimos pedidos do dia",
    "dash.verTodos":          "Ver todos",
    "dash.funilPedidos":      "Funil de Pedidos",
    "dash.faturamentoSemanal":"Faturamento Semanal",
    "dash.nenhumPedido":      "Nenhum pedido hoje",
    "dash.inicieCadastrando": "Inicie cadastrando seu primeiro pedido.",
    "dash.totalPedidos":      "TOTAL",
    "dash.addPedido":         "Adicionar Pedido",
    // ── Table headers ───────────────────────────────────
    "table.id":       "ID",
    "table.cliente":  "Cliente",
    "table.data":     "Data",
    "table.status":   "Status",
    "table.valor":    "Valor",
    "table.acoes":    "Ações",
    // ── Status labels ───────────────────────────────────
    "status.concluido": "Concluído",
    "status.entrega":   "Entrega",
    "status.preparo":   "Preparo",
    "status.pedido":    "Pedido",
    // ── Sidebar sections ────────────────────────────────
    "nav.gestao":         "GESTÃO",
    "nav.financeiro":     "FINANCEIRO",
    "nav.relatorios":     "RELATÓRIOS",
    "nav.configuracoes":  "CONFIGURAÇÕES",
    "nav.entrar":         "Entrar",
    "nav.modoDemo":       "Modo Demo",
    // ── Pages ───────────────────────────────────────────
    "page.dashboard":    "Dashboard",
    "page.clientes":     "Clientes",
    "page.leads":        "Leads",
    "page.pedidos":      "Pedidos",
    "page.vendas":       "Vendas",
    "page.logistica":    "Logística",
    "page.financeiro":   "Financeiro",
    "page.produtos":     "Produtos",
    "page.relatorios":   "Relatórios",
    "page.graficos":     "Gráficos",
    "page.desempenho":   "Desempenho",
    "page.configuracoes":"Configurações",
    // ── Topbar ──────────────────────────────────────────
    "topbar.buscar":     "Buscar clientes, pedidos...",
    "topbar.bemVindo":   "Bem-vindo(a) ao Açaí Go CRM",
    "topbar.ola":        "Olá",
    // ── Greetings ───────────────────────────────────────
    "demo.banner":       "Modo Demonstração",
    "demo.fazerLogin":   "Fazer Login",
  },

  en: {
    // ── Dashboard KPIs ──────────────────────────────────
    "kpi.faturamentoHoje":  "Today's Revenue",
    "kpi.pedidosHoje":      "Today's Orders",
    "kpi.novosClientes":    "New Clients",
    "kpi.ticketMedio":      "Avg. Ticket",
    "kpi.vsOntem":          "vs yesterday",
    // ── Dashboard sections ───────────────────────────────
    "dash.faturamentoDia":    "Daily Revenue",
    "dash.comparadoOntem":    "+21.3% compared to yesterday",
    "dash.statusPedidos":     "Order Status",
    "dash.hoje":              "Today",
    "dash.pedidosRecentes":   "Recent Orders",
    "dash.ultimosPedidos":    "Today's latest orders",
    "dash.verTodos":          "View all",
    "dash.funilPedidos":      "Order Funnel",
    "dash.faturamentoSemanal":"Weekly Revenue",
    "dash.nenhumPedido":      "No orders today",
    "dash.inicieCadastrando": "Start by registering your first order.",
    "dash.totalPedidos":      "TOTAL",
    "dash.addPedido":         "Add Order",
    // ── Table headers ───────────────────────────────────
    "table.id":       "ID",
    "table.cliente":  "Client",
    "table.data":     "Date",
    "table.status":   "Status",
    "table.valor":    "Value",
    "table.acoes":    "Actions",
    // ── Status labels ───────────────────────────────────
    "status.concluido": "Completed",
    "status.entrega":   "Delivery",
    "status.preparo":   "Preparing",
    "status.pedido":    "Order",
    // ── Sidebar sections ────────────────────────────────
    "nav.gestao":         "MANAGEMENT",
    "nav.financeiro":     "FINANCIAL",
    "nav.relatorios":     "REPORTS",
    "nav.configuracoes":  "SETTINGS",
    "nav.entrar":         "Sign In",
    "nav.modoDemo":       "Demo Mode",
    // ── Pages ───────────────────────────────────────────
    "page.dashboard":    "Dashboard",
    "page.clientes":     "Clients",
    "page.leads":        "Leads",
    "page.pedidos":      "Orders",
    "page.vendas":       "Sales",
    "page.logistica":    "Logistics",
    "page.financeiro":   "Financial",
    "page.produtos":     "Products",
    "page.relatorios":   "Reports",
    "page.graficos":     "Charts",
    "page.desempenho":   "Performance",
    "page.configuracoes":"Settings",
    // ── Topbar ──────────────────────────────────────────
    "topbar.buscar":     "Search clients, orders...",
    "topbar.bemVindo":   "Welcome to Açaí Go CRM",
    "topbar.ola":        "Hello",
    // ── Demo ────────────────────────────────────────────
    "demo.banner":       "Demo Mode",
    "demo.fazerLogin":   "Sign In",
  },

  es: {
    // ── Dashboard KPIs ──────────────────────────────────
    "kpi.faturamentoHoje":  "Ingresos de Hoy",
    "kpi.pedidosHoje":      "Pedidos de Hoy",
    "kpi.novosClientes":    "Nuevos Clientes",
    "kpi.ticketMedio":      "Ticket Promedio",
    "kpi.vsOntem":          "vs ayer",
    // ── Dashboard sections ───────────────────────────────
    "dash.faturamentoDia":    "Ingresos del Día",
    "dash.comparadoOntem":    "+21,3% comparado con ayer",
    "dash.statusPedidos":     "Estado de Pedidos",
    "dash.hoje":              "Hoy",
    "dash.pedidosRecentes":   "Pedidos Recientes",
    "dash.ultimosPedidos":    "Últimos pedidos de hoy",
    "dash.verTodos":          "Ver todos",
    "dash.funilPedidos":      "Embudo de Pedidos",
    "dash.faturamentoSemanal":"Ingresos Semanales",
    "dash.nenhumPedido":      "Sin pedidos hoy",
    "dash.inicieCadastrando": "Comienza registrando tu primer pedido.",
    "dash.totalPedidos":      "TOTAL",
    "dash.addPedido":         "Agregar Pedido",
    // ── Table headers ───────────────────────────────────
    "table.id":       "ID",
    "table.cliente":  "Cliente",
    "table.data":     "Fecha",
    "table.status":   "Estado",
    "table.valor":    "Valor",
    "table.acoes":    "Acciones",
    // ── Status labels ───────────────────────────────────
    "status.concluido": "Completado",
    "status.entrega":   "Entrega",
    "status.preparo":   "Preparando",
    "status.pedido":    "Pedido",
    // ── Sidebar sections ────────────────────────────────
    "nav.gestao":         "GESTIÓN",
    "nav.financeiro":     "FINANCIERO",
    "nav.relatorios":     "INFORMES",
    "nav.configuracoes":  "AJUSTES",
    "nav.entrar":         "Iniciar Sesión",
    "nav.modoDemo":       "Modo Demo",
    // ── Pages ───────────────────────────────────────────
    "page.dashboard":    "Panel",
    "page.clientes":     "Clientes",
    "page.leads":        "Leads",
    "page.pedidos":      "Pedidos",
    "page.vendas":       "Ventas",
    "page.logistica":    "Logística",
    "page.financeiro":   "Finanzas",
    "page.produtos":     "Productos",
    "page.relatorios":   "Informes",
    "page.graficos":     "Gráficos",
    "page.desempenho":   "Rendimiento",
    "page.configuracoes":"Configuración",
    // ── Topbar ──────────────────────────────────────────
    "topbar.buscar":     "Buscar clientes, pedidos...",
    "topbar.bemVindo":   "Bienvenido a Açaí Go CRM",
    "topbar.ola":        "Hola",
    // ── Demo ────────────────────────────────────────────
    "demo.banner":       "Modo Demostración",
    "demo.fazerLogin":   "Iniciar Sesión",
  },
} as const;

type TranslationKey = keyof typeof translations["pt"];

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "pt",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    const stored = localStorage.getItem("acaigo_lang") as Lang | null;
    if (stored && ["pt", "en", "es"].includes(stored)) setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("acaigo_lang", l);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string =>
      (translations[lang] as Record<string, string>)[key] ?? key,
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
