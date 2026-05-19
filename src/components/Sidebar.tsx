"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { ROLE_LABELS, ROLE_COLORS, type Role, type Permission } from '@/lib/permissions';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  LayoutDashboard, Users, Target, Package, CircleDollarSign,
  Banknote, ShoppingBag, BarChart2, LineChart, Activity, Settings, LogOut, Truck, X, MapPin
} from 'lucide-react';

type NavItem = { name: string; href: string; icon: React.ElementType; permission: Permission };
type NavGroup = { label: string; items: NavItem[] };

// Menu para roles normais (DONO, GERENTE, ATENDENTE)
const sidebarGroups: NavGroup[] = [
  {
    label: "Gestão",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard, permission: "dashboard:view" },
      { name: "Clientes", href: "/clientes", icon: Users, permission: "clientes:view" },
      { name: "Leads", href: "/leads", icon: Target, permission: "leads:view" },
      { name: "Pedidos", href: "/pedidos", icon: Package, permission: "pedidos:view" },
      { name: "Vendas", href: "/vendas", icon: CircleDollarSign, permission: "pedidos:view" },
      { name: "Logística", href: "/logistica", icon: Truck, permission: "logistica:view" },
    ]
  },
  {
    label: "Financeiro",
    items: [
      { name: "Financeiro", href: "/financeiro", icon: Banknote, permission: "financeiro:view" },
      { name: "Produtos", href: "/produtos", icon: ShoppingBag, permission: "produtos:view" },
    ]
  },
  {
    label: "Relatórios",
    items: [
      { name: "Relatórios", href: "/relatorios", icon: BarChart2, permission: "relatorios:view" },
      { name: "Gráficos", href: "/graficos", icon: LineChart, permission: "graficos:view" },
      { name: "Desempenho", href: "/desempenho", icon: Activity, permission: "relatorios:view" },
    ]
  },
  {
    label: "Configurações",
    items: [
      { name: "Configurações", href: "/configuracoes", icon: Settings, permission: "configuracoes:view" },
    ]
  }
];

// Menu exclusivo para MOTOBOY
const motoboyGroups: NavGroup[] = [
  {
    label: "Entregador",
    items: [
      { name: "Minhas Entregas", href: "/entrega", icon: MapPin, permission: "entrega:view" },
    ]
  },
  {
    label: "Conta",
    items: [
      { name: "Configurações", href: "/configuracoes", icon: Settings, permission: "configuracoes:view" },
    ]
  }
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { usuario, logout } = useAuth();
  const { can, isLoading } = usePermissions();

  const initials = usuario?.nome
    ? usuario.nome.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
    : "AG";

  const role = (usuario?.role ?? "ATENDENTE") as Role;
  const roleLabel = ROLE_LABELS[role] ?? role;
  const roleColor = ROLE_COLORS[role] ?? "text-muted-foreground bg-muted";

  return (
    <div className="w-60 min-w-[240px] h-full bg-card border-r border-border flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-border px-2 py-3">
        <div className="flex-1 min-w-0">
          <Logo />
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden ml-1 p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 flex flex-col gap-3 px-3 py-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {(role === "MOTOBOY" ? motoboyGroups : sidebarGroups).map((group, idx) => {
          // During loading, show all items (avoids empty mobile drawer)
          const visibleItems = isLoading
            ? group.items
            : group.items.filter(item => can(item.permission));
          if (visibleItems.length === 0) return null;
          return (
            <div key={idx}>
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 px-2">
                {group.label}
              </div>
              <div className="flex flex-col gap-0.5">
                {visibleItems.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Açaí Hero Image */}
      <div className="relative flex items-end justify-center overflow-visible pb-0 mt-2 mx-2">
        <div className="absolute inset-x-0 bottom-0 h-[130px] rounded-xl overflow-hidden">
          <div
            className="w-full h-full"
            style={{
              background: "radial-gradient(ellipse at 50% 110%, rgba(124,58,237,0.4) 0%, rgba(109,40,217,0.15) 55%, transparent 80%)",
            }}
          />
        </div>
        <div className="relative z-10">
          <img
            src="/images/3.png"
            alt="Açaí Go"
            className="w-auto max-h-[130px] object-contain drop-shadow-[0_14px_32px_rgba(124,58,237,0.6)] hover:scale-105 transition-transform duration-300"
          />
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2"
            style={{
              width: "120px",
              height: "18px",
              background: "radial-gradient(ellipse at center, rgba(124,58,237,0.85) 0%, rgba(109,40,217,0.3) 55%, transparent 80%)",
              filter: "blur(7px)",
            }}
          />
        </div>
      </div>

      {/* User section */}
      <div className="px-3 py-2 border-t border-border">
        <Link href="/configuracoes" onClick={onClose} className="flex items-center gap-2.5 group hover:bg-muted/50 p-2 -m-2 rounded-xl transition-all cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-primary-foreground flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-foreground truncate">{usuario?.nome || "Açaí Gestor"}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none ${roleColor}`}>
                {roleLabel}
              </span>
            </div>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); logout(); }}
            title="Sair"
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Desktop: sidebar fixa */}
      <aside className="hidden lg:flex h-screen flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile: overlay + drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          {/* Drawer */}
          <aside className="relative z-10 h-full flex flex-col animate-in slide-in-from-left-full duration-300">
            <SidebarContent onClose={close} />
          </aside>
        </div>
      )}
    </>
  );
}
