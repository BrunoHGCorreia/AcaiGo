import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Login — Açaí GO CRM",
  description: "Acesse o painel de gestão do Açaí Go",
};

/**
 * Layout isolado para a página de login.
 * Substitui completamente o root layout — sem Sidebar, Topbar ou AuthProvider.
 * O <html> e <body> aqui sobrescrevem o root layout para esta rota.
 */
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <div className="min-h-screen w-full">
        {children}
      </div>
    </ThemeProvider>
  );
}
