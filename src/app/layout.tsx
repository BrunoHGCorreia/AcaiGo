import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { VitrineProvider } from "@/contexts/VitrineContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "react-hot-toast";
import { AppShell } from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Açaí GO CRM & Gestão",
  description: "Dashboard e CRM para gerenciamento de vendas de açaí",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <LanguageProvider>
              <VitrineProvider>
                <SidebarProvider>
                  <AppShell>{children}</AppShell>
                  <Toaster position="bottom-right" toastOptions={{
                    className: 'bg-card text-foreground border border-border shadow-lg rounded-xl text-sm font-medium',
                    style: { background: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }
                  }} />
                </SidebarProvider>
              </VitrineProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
