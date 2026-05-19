"use client";
import { type Permission } from "@/lib/permissions";
import { usePermissions } from "@/hooks/usePermissions";

interface RoleGuardProps {
  /** Required permission to render children */
  permission: Permission;
  /** Optional fallback element shown when permission is denied */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Wraps any UI element and renders it only when the current user
 * has the required permission. Otherwise renders `fallback` (default: null).
 *
 * @example
 * <RoleGuard permission="pedidos:delete">
 *   <button>Excluir Pedido</button>
 * </RoleGuard>
 */
export function RoleGuard({ permission, fallback = null, children }: RoleGuardProps) {
  const { can, isLoading } = usePermissions();
  if (isLoading) return null;
  if (!can(permission)) return <>{fallback}</>;
  return <>{children}</>;
}
