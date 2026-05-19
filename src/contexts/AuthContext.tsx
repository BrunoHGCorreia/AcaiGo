"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cargo: string;
  role: string;
  fotoUrl?: string;
  preferencias?: {
    tema: string;
    notifPedidos: boolean;
    notifFinanceiro: boolean;
    notifLeads: boolean;
    notifSistema: boolean;
  };
};

type AuthContextType = {
  usuario: Usuario | null;
  loading: boolean;
  refresh: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  loading: true,
  refresh: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        setUsuario(data.usuario);
      } else {
        // Session invalid or user no longer exists — force full logout
        setUsuario(null);
        // Clear the stale cookie by calling logout endpoint
        await fetch("/api/auth/logout", { method: "POST" });
        // Redirect to login only if not already there
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    } catch {
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSession(); }, [fetchSession]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUsuario(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, refresh: fetchSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
