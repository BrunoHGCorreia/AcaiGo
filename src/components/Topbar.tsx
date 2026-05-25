"use client";

import { Sun, Moon, Menu, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationsPanel } from "./NotificationsPanel";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";

const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: "pt", flag: "🇧🇷", label: "Português" },
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "es", flag: "🇪🇸", label: "Español" },
];

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { toggle } = useSidebar();
  const { usuario } = useAuth();
  const { lang, setLang, t } = useLanguage();

  const primeiroNome = usuario?.nome?.split(" ")[0] ?? "Gestor";
  const currentLang = LANGS.find(l => l.code === lang) ?? LANGS[0];

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
          {usuario ? `${t("topbar.ola")}, ${primeiroNome}! 👋` : t("topbar.bemVindo")}
        </h2>
        <p className="text-xs text-muted-foreground">
          {usuario ? t("topbar.bemVindo") : t("demo.banner")}
        </p>
      </div>

      {/* Ações lado direito */}
      <div className="flex items-center gap-2 lg:gap-3 ml-auto">
        {/* Global Search */}
        <GlobalSearch />

        {/* Data — só a partir de sm */}
        <div className="text-xs font-medium text-muted-foreground hidden sm:block flex-shrink-0">
          {new Date().toLocaleDateString(lang === "pt" ? "pt-BR" : lang === "en" ? "en-US" : "es-ES", {
            day: "numeric", month: "short", year: "numeric"
          })}
        </div>

        {/* Notifications */}
        <NotificationsPanel />

        {/* Language switcher */}
        {mounted && (
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setLangOpen(o => !o)}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-base"
              title="Idioma / Language / Idioma"
            >
              <span className="text-sm">{currentLang.flag}</span>
            </button>

            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 w-36 rounded-xl border border-border bg-card shadow-xl overflow-hidden">
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-sm transition-colors hover:bg-muted ${lang === l.code ? "text-primary font-semibold" : "text-foreground"}`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                      {lang === l.code && <span className="ml-auto text-primary text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

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
