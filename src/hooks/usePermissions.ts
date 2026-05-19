"use client";
import { useAuth } from "@/contexts/AuthContext";
import { can, type Permission, type Role } from "@/lib/permissions";

/**
 * Hook for checking permissions in client components.
 *
 * @example
 * const { can: userCan, role } = usePermissions();
 * if (userCan("pedidos:delete")) { ... }
 */
export function usePermissions() {
  const { usuario, loading } = useAuth();
  const role = (usuario?.role ?? null) as Role | null;

  return {
    role,
    isLoading: loading,
    /** Check if the current user has a given permission */
    can: (permission: Permission) => can(role, permission),
    /** Check if the current user has one of the given roles */
    hasRole: (...roles: Role[]) => role !== null && roles.includes(role),
    /** True if the user is authenticated */
    isAuthenticated: usuario !== null,
  };
}
