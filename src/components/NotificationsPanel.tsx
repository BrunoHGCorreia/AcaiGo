"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Package, DollarSign, AlertTriangle, CheckCircle, X } from "lucide-react";

type Notification = {
  id: number;
  type: "pedido" | "financeiro" | "alerta" | "sistema";
  title: string;
  desc: string;
  time: string;
  read: boolean;
  href?: string;
};

const initialNotifications: Notification[] = [
  { id: 1, type: "pedido", title: "Novo pedido recebido", desc: "João Silva fez um pedido de R$ 58,90", time: "há 2 min", read: false, href: "/pedidos" },
  { id: 2, type: "alerta", title: "Estoque crítico", desc: "Mel Natural está com apenas 12 unidades", time: "há 15 min", read: false, href: "/produtos" },
  { id: 3, type: "pedido", title: "Pedido #1255 — Preparo", desc: "Carlos Santos aguarda preparo do pedido", time: "há 32 min", read: false, href: "/pedidos" },
  { id: 4, type: "financeiro", title: "Meta diária atingida!", desc: "Você superou R$ 2.000 em faturamento hoje", time: "há 1h", read: true, href: "/financeiro" },
  { id: 5, type: "sistema", title: "Relatório gerado", desc: "Relatório de Abril 2026 está pronto", time: "há 3h", read: true, href: "/relatorios" },
];

const typeConfig = {
  pedido:     { icon: Package,       color: "text-blue-500",    bg: "bg-blue-500/10" },
  financeiro: { icon: DollarSign,    color: "text-emerald-500", bg: "bg-emerald-500/10" },
  alerta:     { icon: AlertTriangle, color: "text-amber-500",   bg: "bg-amber-500/10" },
  sistema:    { icon: CheckCircle,   color: "text-violet-500",  bg: "bg-violet-500/10" },
};

export function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        title="Notificações"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[9px] font-bold text-white flex items-center justify-center border-2 border-card">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[360px] rounded-xl border border-border bg-card shadow-2xl shadow-black/30 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Notificações</h3>
              {unread > 0 && (
                <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">{unread}</span>
              )}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary hover:underline font-medium">
                Marcar todas como lidas
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-30" />
                <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
              </div>
            ) : notifications.map(n => {
              const cfg = typeConfig[n.type];
              const Icon = cfg.icon;
              return (
                <div
                  key={n.id}
                  onClick={() => { markRead(n.id); setOpen(false); router.push(n.href ?? "/"); }}
                  className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-muted/40 ${!n.read ? "bg-primary/5" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg}`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-[13px] leading-tight ${n.read ? "font-medium text-foreground" : "font-semibold text-foreground"}`}>
                        {n.title}
                      </p>
                      <button
                        onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                        className="text-muted-foreground hover:text-foreground flex-shrink-0 mt-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{n.desc}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                  </div>
                  {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-border">
            <button
              onClick={() => { setOpen(false); router.push("/pedidos"); }}
              className="text-xs text-primary hover:underline font-medium w-full text-center"
            >
              Ver todas as notificações
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
