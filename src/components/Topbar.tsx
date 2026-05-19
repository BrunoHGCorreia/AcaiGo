"use client";

import { Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationsPanel } from "./NotificationsPanel";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAuth } from "@/contexts/AuthContext";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { toggle } = useSidebar();
  const { usuario } = useAuth();

  const primeiroNome = usuario?.nome?.split(" ")[0] ?? "Gestor";

  useEffect(() => setMounted(true), []);

  return (
    <header className="h-14 lg:h-16 flex items-center justify-between px-4 lg:px-6 bg-card border-b border-border flex-shrink-0 gap-3">
      {/* Hambúrguer — só mobile */}
      <button
        onClick={toggle}
        className="lg:hidden w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
        title="Menu"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Saudação — só desktop */}
      <div className="hidden lg:block flex-shrink-0">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Olá, {primeiroNome}! 👋
        </h2>
        <p className="text-xs text-muted-foreground">Bem-vindo(a) ao Açaí Go CRM</p>
      </div>

      {/* Ações lado direito */}
      <div className="flex items-center gap-2 lg:gap-3 ml-auto">
        {/* Global Search */}
        <GlobalSearch />

        {/* Data — só a partir de sm */}
        <div className="text-xs font-medium text-muted-foreground hidden sm:block flex-shrink-0">
          {new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}
        </div>

        {/* Notifications */}
        <NotificationsPanel />

        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
            title="Alternar tema"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}
      </div>
    </header>
  );
}
