"use client";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

const REMEMBER_KEY = "acaigo_remembered_email";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    fetch("/api/auth/session")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.usuario) window.location.href = "/"; })
      .finally(() => setChecking(false));
  }, []);

  // Load remembered email on mount
  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      setForm(f => ({ ...f, email: saved }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao fazer login");
        return;
      }

      // Save or clear email based on "remember me"
      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, form.email);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      // Full reload to ensure AuthContext re-fetches session with correct role
      window.location.href = "/";
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.6) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.8) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Açaí GO CRM</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Acesse o painel de gestão</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card shadow-2xl shadow-black/40 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground transition-all placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="login-password"
                  type={showSenha ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={form.senha}
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 text-sm rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground transition-all placeholder:text-muted-foreground/50"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2.5">
              <button
                id="remember-me"
                type="button"
                role="checkbox"
                aria-checked={rememberMe}
                onClick={() => setRememberMe(v => !v)}
                className={`w-4 h-4 rounded flex items-center justify-center border transition-all flex-shrink-0 ${
                  rememberMe
                    ? "bg-primary border-primary"
                    : "border-border bg-background hover:border-primary/50"
                }`}
              >
                {rememberMe && (
                  <svg className="w-2.5 h-2.5 text-primary-foreground" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <label
                htmlFor="remember-me"
                onClick={() => setRememberMe(v => !v)}
                className="text-xs text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
              >
                Manter login por <strong className="text-foreground">30 dias</strong>
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 shadow-lg shadow-primary/30"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center gap-2 mt-6">
          <p className="text-center text-[11px] text-muted-foreground">
            © 2026 Açaí Go CRM · Todos os direitos reservados
          </p>
          <button
            onClick={() => window.location.href = "/"}
            className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
          >
            ← Ver site demonstrativo
          </button>
        </div>
      </div>
    </div>
  );
}
