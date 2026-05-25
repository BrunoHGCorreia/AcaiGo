"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Sparkles, LogIn } from "lucide-react";

const translations = {
  pt: {
    banner: "Você está no modo demonstração — os dados são fictícios.",
    login: "Fazer Login",
    cta: "Acesse o sistema real com seus dados",
  },
  en: {
    banner: "You are in demo mode — data is fictional.",
    login: "Log In",
    cta: "Access the real system with your data",
  },
  es: {
    banner: "Estás en modo demostración — los datos son ficticios.",
    login: "Iniciar Sesión",
    cta: "Accede al sistema real con tus datos",
  },
};

type Lang = keyof typeof translations;

function detectLang(): Lang {
  if (typeof window === "undefined") return "pt";
  const lang = navigator.language?.toLowerCase();
  if (lang.startsWith("en")) return "en";
  if (lang.startsWith("es")) return "es";
  return "pt";
}

export function DemoBanner() {
  const { usuario, loading } = useAuth();
  const router = useRouter();

  // Only show when not logged in
  if (loading || usuario) return null;

  const lang = detectLang();
  const t = translations[lang];

  return (
    <div className="w-full bg-gradient-to-r from-violet-600/95 via-purple-600/95 to-violet-700/95 backdrop-blur-sm border-b border-violet-500/30 px-4 py-2.5 flex items-center justify-between gap-3 z-50 flex-shrink-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <p className="text-sm text-white/90 font-medium truncate">
          <span className="font-bold text-white">Demo</span>
          {" · "}
          {t.banner}
        </p>
      </div>
      <button
        onClick={() => router.push("/login")}
        className="flex items-center gap-1.5 bg-white text-violet-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-white/90 transition-colors flex-shrink-0 shadow-sm"
      >
        <LogIn className="w-3.5 h-3.5" />
        {t.login}
      </button>
    </div>
  );
}
