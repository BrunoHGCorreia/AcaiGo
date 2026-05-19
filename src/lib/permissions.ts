/**
 * Açaí GO — RBAC Permission System (Fase 3)
 *
 * Hierarchy (highest → lowest):
 *   DONO > GERENTE > ATENDENTE > MOTOBOY
 *
 * Usage in server: check header x-user-role
 * Usage in client: import { usePermissions } from "@/hooks/usePermissions"
 */

export type Role = "DONO" | "GERENTE" | "ATENDENTE" | "MOTOBOY";

// Role display names and colors for UI
export const ROLE_LABELS: Record<Role, string> = {
  DONO: "Dono",
  GERENTE: "Gerente",
  ATENDENTE: "Atendente",
  MOTOBOY: "Motoboy",
};

export const ROLE_COLORS: Record<Role, string> = {
  DONO: "text-amber-400 bg-amber-400/10",
  GERENTE: "text-violet-400 bg-violet-400/10",
  ATENDENTE: "text-sky-400 bg-sky-400/10",
  MOTOBOY: "text-emerald-400 bg-emerald-400/10",
};

// ─── Permission Matrix ────────────────────────────────────────────────────────

export type Permission =
  // Dashboard
  | "dashboard:view"           // Todos
  // Pedidos
  | "pedidos:view"             // Todos
  | "pedidos:create"           // DONO, GERENTE, ATENDENTE
  | "pedidos:status_update"    // DONO, GERENTE, ATENDENTE
  | "pedidos:delete"           // DONO
  // Clientes
  | "clientes:view"            // DONO, GERENTE, ATENDENTE
  | "clientes:create"          // DONO, GERENTE, ATENDENTE
  | "clientes:edit"            // DONO, GERENTE
  | "clientes:delete"          // DONO
  // Produtos
  | "produtos:view"            // DONO, GERENTE, ATENDENTE
  | "produtos:create"          // DONO, GERENTE
  | "produtos:edit"            // DONO, GERENTE
  | "produtos:delete"          // DONO
  // Financeiro
  | "financeiro:view"          // DONO, GERENTE
  // Leads
  | "leads:view"               // DONO, GERENTE
  | "leads:create"             // DONO, GERENTE
  | "leads:edit"               // DONO, GERENTE
  | "leads:delete"             // DONO
  // Logística / Entregadores
  | "logistica:view"           // DONO, GERENTE, ATENDENTE
  | "logistica:dispatch"       // DONO, GERENTE, ATENDENTE
  | "logistica:manage"         // DONO, GERENTE
  | "logistica:entregador_status" // MOTOBOY (próprio)
  // Relatórios & Gráficos
  | "relatorios:view"          // DONO, GERENTE
  | "graficos:view"            // DONO, GERENTE
  // Configurações
  | "configuracoes:view"       // Todos (próprio perfil)
  | "configuracoes:loja"       // DONO
  | "configuracoes:usuarios"   // DONO
  // Entrega (Motoboy)
  | "entrega:view"             // MOTOBOY, DONO, GERENTE
  // Ações destrutivas
  | "admin:full";              // DONO apenas

const PERMISSIONS: Record<Role, Permission[]> = {
  DONO: [
    "dashboard:view",
    "pedidos:view", "pedidos:create", "pedidos:status_update", "pedidos:delete",
    "clientes:view", "clientes:create", "clientes:edit", "clientes:delete",
    "produtos:view", "produtos:create", "produtos:edit", "produtos:delete",
    "financeiro:view",
    "leads:view", "leads:create", "leads:edit", "leads:delete",
    "logistica:view", "logistica:dispatch", "logistica:manage",
    "relatorios:view", "graficos:view",
    "configuracoes:view", "configuracoes:loja", "configuracoes:usuarios",
    "entrega:view",
    "admin:full",
  ],
  GERENTE: [
    "dashboard:view",
    "pedidos:view", "pedidos:create", "pedidos:status_update",
    "clientes:view", "clientes:create", "clientes:edit",
    "produtos:view", "produtos:create", "produtos:edit",
    "financeiro:view",
    "leads:view", "leads:create", "leads:edit",
    "logistica:view", "logistica:dispatch", "logistica:manage",
    "relatorios:view", "graficos:view",
    "configuracoes:view",
    "entrega:view",
  ],
  ATENDENTE: [
    "dashboard:view",
    "pedidos:view", "pedidos:create", "pedidos:status_update",
    "clientes:view", "clientes:create", "clientes:edit",
    "produtos:view", "produtos:create", "produtos:edit",
    "logistica:view", "logistica:dispatch", "logistica:manage",
    "entrega:view",
    "configuracoes:view",
  ],
  MOTOBOY: [
    "dashboard:view",
    "pedidos:view",
    "logistica:view", "logistica:entregador_status",
    "configuracoes:view",
    "entrega:view",
  ],
};

/** Returns true if a given role has the specified permission */
export function can(role: Role | string | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  const roleKey = role as Role;
  if (!PERMISSIONS[roleKey]) return false;
  return PERMISSIONS[roleKey].includes(permission);
}

/** Returns all permissions for a role */
export function getPermissions(role: Role | string): Permission[] {
  return PERMISSIONS[role as Role] ?? [];
}

/** Sidebar menu items visibility per role */
export const SIDEBAR_VISIBILITY: Record<string, Permission> = {
  "/": "dashboard:view",
  "/pedidos": "pedidos:view",
  "/clientes": "clientes:view",
  "/produtos": "produtos:view",
  "/financeiro": "financeiro:view",
  "/leads": "leads:view",
  "/logistica": "logistica:view",
  "/relatorios": "relatorios:view",
  "/graficos": "graficos:view",
  "/configuracoes": "configuracoes:view",
};
