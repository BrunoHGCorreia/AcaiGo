"use client";
import { useState, useEffect } from "react";
import { User, Bell, Palette, Lock, Save, Moon, Sun, Store, Loader2, Users, Plus, Edit2, Trash2, X, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import useSWR from "swr";
import toast from "react-hot-toast";
import { formatPhone } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";
import ConfirmDelete from "@/components/modals/ConfirmDelete";

const fetcher = (url: string) => fetch(url).then(r => r.json());

const ROLE_OPTIONS = [
  { value: "DONO", label: "Dono", color: "text-amber-400 bg-amber-400/10" },
  { value: "GERENTE", label: "Gerente", color: "text-violet-400 bg-violet-400/10" },
  { value: "ATENDENTE", label: "Atendente", color: "text-sky-400 bg-sky-400/10" },
  { value: "MOTOBOY", label: "Motoboy", color: "text-emerald-400 bg-emerald-400/10" },
];

function RoleBadge({ role }: { role: string }) {
  const opt = ROLE_OPTIONS.find(r => r.value === role);
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${opt?.color ?? "text-muted-foreground bg-muted"}`}>
      {opt?.label ?? role}
    </span>
  );
}

function FuncionarioModal({ onClose, onSave, funcionario }: {
  onClose: () => void;
  onSave: () => void;
  funcionario?: any;
}) {
  const [form, setForm] = useState({
    nome: funcionario?.nome ?? "",
    email: funcionario?.email ?? "",
    cargo: funcionario?.cargo ?? "Atendente",
    roleNovo: funcionario?.role ?? "ATENDENTE",
    novaSenha: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = funcionario ? `/api/usuarios/${funcionario.id}` : "/api/usuarios";
      const method = funcionario ? "PUT" : "POST";
      const body = funcionario
        ? { nome: form.nome, email: form.email, cargo: form.cargo, roleNovo: form.roleNovo, ...(form.novaSenha ? { novaSenha: form.novaSenha } : {}) }
        : { nome: form.nome, email: form.email, cargo: form.cargo, roleNovo: form.roleNovo, senha: form.novaSenha };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(funcionario ? "Funcionário atualizado!" : "Funcionário criado!");
      onSave();
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const ic = "w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary/30 text-foreground transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">{funcionario ? "Editar Funcionário" : "Novo Funcionário"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Nome completo *</label>
              <input className={ic} value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} required />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Email *</label>
              <input className={ic} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Cargo</label>
              <input className={ic} value={form.cargo} onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Nível de acesso *</label>
              <select className={ic} value={form.roleNovo} onChange={e => setForm(f => ({ ...f, roleNovo: e.target.value }))}>
                {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">{funcionario ? "Nova senha (deixe em branco para não alterar)" : "Senha *"}</label>
              <input className={ic} type="password" value={form.novaSenha} onChange={e => setForm(f => ({ ...f, novaSenha: e.target.value }))} minLength={funcionario ? 0 : 6} required={!funcionario} placeholder={funcionario ? "••••••••" : "Mínimo 6 caracteres"} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-border rounded-lg py-2.5 text-sm hover:bg-muted transition-colors">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Configuracoes() {
  const { usuario, refresh } = useAuth();
  const { theme, setTheme } = useTheme();
  const { can } = usePermissions();
  const canManageUsers = can("configuracoes:usuarios");

  const [tab, setTab] = useState("perfil");
  const [loading, setLoading] = useState(false);

  // Perfil State
  const [perfilForm, setPerfilForm] = useState({
    nome: "", email: "", telefone: "", cargo: ""
  });

  // Loja State
  const [lojaForm, setLojaForm] = useState({
    nome: "", cnpj: "", endereco: "", bairro: "", cidade: "", cep: "", horarioAbre: "", horarioFecha: ""
  });

  // Preferencias State
  const [notifForm, setNotifForm] = useState({
    notifPedidos: true, notifFinanceiro: true, notifLeads: false, notifSistema: true
  });

  // Segurança State
  const [senhaForm, setSenhaForm] = useState({
    senhaAtual: "", novaSenha: "", confirmSenha: ""
  });

  useEffect(() => {
    if (usuario) {
      setPerfilForm({
        nome: usuario.nome || "",
        email: usuario.email || "",
        telefone: usuario.telefone || "",
        cargo: usuario.cargo || ""
      });
      if (usuario.preferencias) {
        setNotifForm({
          notifPedidos: usuario.preferencias.notifPedidos,
          notifFinanceiro: usuario.preferencias.notifFinanceiro,
          notifLeads: usuario.preferencias.notifLeads,
          notifSistema: usuario.preferencias.notifSistema
        });
      }
    }
  }, [usuario]);

  useEffect(() => {
    fetch("/api/loja").then(r => r.json()).then(d => {
      if (d.loja) {
        setLojaForm({
          nome: d.loja.nome || "",
          cnpj: d.loja.cnpj || "",
          endereco: d.loja.endereco || "",
          bairro: d.loja.bairro || "",
          cidade: d.loja.cidade || "",
          cep: d.loja.cep || "",
          horarioAbre: d.loja.horarioAbre || "08:00",
          horarioFecha: d.loja.horarioFecha || "22:00"
        });
      }
    });
  }, []);

  const handleSavePerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/perfil", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(perfilForm)
      });
      if (res.ok) {
        toast.success("Perfil atualizado com sucesso!");
        refresh();
      } else {
        const d = await res.json();
        toast.error(d.error || "Erro ao atualizar perfil");
      }
    } catch {
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLoja = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/loja", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lojaForm)
      });
      if (res.ok) {
        toast.success("Dados da loja atualizados!");
      } else {
        const d = await res.json();
        toast.error(d.error || "Erro ao atualizar loja");
      }
    } catch {
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferencias = async () => {
    setLoading(true);
    try {
      const payload = {
        tema: theme || "dark",
        ...notifForm
      };
      const res = await fetch("/api/preferencias", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success("Preferências salvas!");
        refresh();
      } else {
        const d = await res.json();
        toast.error(d.error || "Erro ao salvar preferências");
      }
    } catch {
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    setTimeout(() => {
      handleSavePreferencias();
    }, 100);
  };

  const handleNotifToggle = (key: keyof typeof notifForm) => {
    setNotifForm(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      // Save automatically
      fetch("/api/preferencias", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema: theme || "dark", ...updated })
      }).then(() => refresh());
      return updated;
    });
  };

  const handleSaveSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senhaForm.novaSenha !== senhaForm.confirmSenha) {
      toast.error("As novas senhas não coincidem");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/perfil", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senhaAtual: senhaForm.senhaAtual, novaSenha: senhaForm.novaSenha })
      });
      const d = await res.json();
      if (res.ok) {
        toast.success(d.message || "Senha atualizada com sucesso!");
        setSenhaForm({ senhaAtual: "", novaSenha: "", confirmSenha: "" });
      } else {
        toast.error(d.error || "Erro ao atualizar senha");
      }
    } catch {
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const { data: usuariosData, mutate: mutateUsuarios } = useSWR(
    tab === "funcionarios" ? "/api/usuarios" : null,
    fetcher
  );
  const funcionarios: any[] = usuariosData?.usuarios ?? [];
  const [showFuncModal, setShowFuncModal] = useState(false);
  const [editingFunc, setEditingFunc] = useState<any>(undefined);
  const [deletingFunc, setDeletingFunc] = useState<any>(null);

  const handleDeleteFunc = async (id: number) => {
    try {
      const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Funcionário removido com sucesso!");
      mutateUsuarios();
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao remover funcionário");
    } finally {
      setDeletingFunc(null);
    }
  };

  const tabs = [
    { id: "perfil", label: "Perfil", icon: User },
    { id: "loja", label: "Loja", icon: Store },
    { id: "funcionarios", label: "Funcionários", icon: Users },
    { id: "notificacoes", label: "Notificações", icon: Bell },
    { id: "aparencia", label: "Aparência", icon: Palette },
    { id: "seguranca", label: "Segurança", icon: Lock },
  ];

  const inputClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary/30 text-foreground transition-all";

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Personalize sua conta e preferências</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-[200px] flex-shrink-0">
          <div className="rounded-xl border border-border bg-card p-2 flex flex-row lg:flex-col gap-1 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px] lg:text-[13px] font-medium transition-all text-left whitespace-nowrap ${tab === t.id ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <t.icon className="w-4 h-4 flex-shrink-0" />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-3xl">
          {tab === "perfil" && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-base font-semibold text-foreground mb-6">Informações do Perfil</h2>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-primary-foreground shadow-lg shadow-primary/30">
                  {usuario?.nome ? usuario.nome.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() : "AG"}
                </div>
                <div>
                  <button className="text-sm font-medium text-primary hover:underline">Alterar foto</button>
                  <p className="text-xs text-muted-foreground mt-0.5">Em breve: envio de avatar personalizado</p>
                </div>
              </div>
              <form onSubmit={handleSavePerfil} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nome completo *</label>
                    <input required value={perfilForm.nome} onChange={e => setPerfilForm({ ...perfilForm, nome: e.target.value })} type="text" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email *</label>
                    <input required value={perfilForm.email} onChange={e => setPerfilForm({ ...perfilForm, email: e.target.value })} type="email" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Telefone</label>
                    <input value={perfilForm.telefone} onChange={e => setPerfilForm({ ...perfilForm, telefone: formatPhone(e.target.value) })} type="tel" className={inputClass} placeholder="(11) 99999-0000" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Cargo</label>
                    <input value={perfilForm.cargo} onChange={e => setPerfilForm({ ...perfilForm, cargo: e.target.value })} type="text" className={inputClass} />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 shadow-md shadow-primary/20">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar alterações
                </button>
              </form>
            </div>
          )}

          {tab === "loja" && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-base font-semibold text-foreground mb-6">Dados da Loja</h2>
              <form onSubmit={handleSaveLoja} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nome da loja *</label>
                    <input required value={lojaForm.nome} onChange={e => setLojaForm({ ...lojaForm, nome: e.target.value })} type="text" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">CNPJ</label>
                    <input value={lojaForm.cnpj} onChange={e => setLojaForm({ ...lojaForm, cnpj: e.target.value })} type="text" className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Endereço</label>
                    <input value={lojaForm.endereco} onChange={e => setLojaForm({ ...lojaForm, endereco: e.target.value })} type="text" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Bairro</label>
                    <input value={lojaForm.bairro} onChange={e => setLojaForm({ ...lojaForm, bairro: e.target.value })} type="text" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Cidade</label>
                    <input value={lojaForm.cidade} onChange={e => setLojaForm({ ...lojaForm, cidade: e.target.value })} type="text" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">CEP</label>
                    <input value={lojaForm.cep} onChange={e => setLojaForm({ ...lojaForm, cep: e.target.value })} type="text" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Horário de funcionamento</label>
                    <div className="flex items-center gap-2">
                      <input value={lojaForm.horarioAbre} onChange={e => setLojaForm({ ...lojaForm, horarioAbre: e.target.value })} type="time" className={inputClass} />
                      <span className="text-muted-foreground text-sm">às</span>
                      <input value={lojaForm.horarioFecha} onChange={e => setLojaForm({ ...lojaForm, horarioFecha: e.target.value })} type="time" className={inputClass} />
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 shadow-md shadow-primary/20">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar dados da loja
                </button>
              </form>
            </div>
          )}

          {tab === "notificacoes" && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
              <h2 className="text-base font-semibold text-foreground">Preferências de Notificação</h2>
              {[
                { key: "notifPedidos" as const, label: "Novos pedidos", desc: "Receba alertas quando um novo pedido for feito" },
                { key: "notifFinanceiro" as const, label: "Movimentações financeiras", desc: "Alertas de entradas e saídas importantes" },
                { key: "notifLeads" as const, label: "Novos leads", desc: "Notificações quando novos leads entrarem no funil" },
                { key: "notifSistema" as const, label: "Atualizações do sistema", desc: "Comunicados e novidades do Açaí Go CRM" },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition-all shadow-sm">
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">{n.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                  </div>
                  <button onClick={() => handleNotifToggle(n.key)}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/40 ${notifForm[n.key] ? "bg-primary" : "bg-muted border border-border"}`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${notifForm[n.key] ? "left-[22px]" : "left-[2px]"}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "aparencia" && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-6">
              <h2 className="text-base font-semibold text-foreground">Aparência</h2>
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Tema</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "dark", label: "Escuro", icon: Moon, desc: "Fundo escuro com roxo" },
                    { id: "light", label: "Claro", icon: Sun, desc: "Fundo branco e limpo" },
                  ].map(t => (
                    <button key={t.id} onClick={() => handleThemeChange(t.id as "dark"|"light")}
                      className={`p-5 rounded-xl border-2 text-left transition-all ${theme === t.id ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border bg-background hover:border-border/80"}`}>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${theme === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        <t.icon className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{t.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Idioma</p>
                <select className={inputClass + " cursor-pointer"}>
                  <option>Português (Brasil)</option>
                  <option>English (US)</option>
                  <option>Español</option>
                </select>
                <p className="text-xs text-muted-foreground mt-2">No momento o sistema está disponível apenas em Português.</p>
              </div>
            </div>
          )}

          {tab === "funcionarios" && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-6">
              <div className="flex flex-wrap items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Funcionários</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Gerencie os usuários e níveis de acesso do sistema</p>
                </div>
                {canManageUsers && (
                  <button
                    onClick={() => { setEditingFunc(undefined); setShowFuncModal(true); }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
                  >
                    <Plus className="w-4 h-4" /> Novo Funcionário
                  </button>
                )}
              </div>

              {/* Permission legend */}
              <div className="flex flex-wrap gap-2">
                {ROLE_OPTIONS.map(r => (
                  <span key={r.value} className={`text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1.5 ${r.color}`}>
                    <Shield className="w-3 h-3" /> {r.label}
                  </span>
                ))}
              </div>

              {/* Employees table */}
              {funcionarios.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhum funcionário cadastrado</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {funcionarios.map((f: any) => {
                    const initials = f.nome.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
                    return (
                      <div key={f.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition-all group">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-[13px] font-semibold text-foreground">{f.nome}</p>
                            <RoleBadge role={f.role} />
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{f.email} {f.cargo ? `· ${f.cargo}` : ""}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex-shrink-0">
                          {canManageUsers && (
                            <button
                              onClick={() => { setEditingFunc(f); setShowFuncModal(true); }}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {canManageUsers && (
                            <button
                              onClick={() => setDeletingFunc(f)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Remover"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === "seguranca" && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-base font-semibold text-foreground mb-6">Segurança da Conta</h2>
              <form onSubmit={handleSaveSenha} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Senha atual *</label>
                    <input required value={senhaForm.senhaAtual} onChange={e => setSenhaForm({ ...senhaForm, senhaAtual: e.target.value })} type="password" placeholder="Digite sua senha atual" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nova senha *</label>
                    <input required minLength={8} value={senhaForm.novaSenha} onChange={e => setSenhaForm({ ...senhaForm, novaSenha: e.target.value })} type="password" placeholder="Mínimo 8 caracteres" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Confirmar nova senha *</label>
                    <input required minLength={8} value={senhaForm.confirmSenha} onChange={e => setSenhaForm({ ...senhaForm, confirmSenha: e.target.value })} type="password" placeholder="Confirme a nova senha" className={inputClass} />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex flex-col gap-2">
                  <p className="text-[13px] font-semibold text-foreground">Dicas de segurança:</p>
                  <ul className="text-xs text-muted-foreground space-y-1.5 pl-1">
                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> Use no mínimo 8 caracteres</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> Inclua letras maiúsculas e minúsculas</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> Use números e caracteres especiais</li>
                  </ul>
                </div>
                <button type="submit" disabled={loading} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 shadow-md shadow-primary/20">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />} Alterar senha
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {showFuncModal && (
        <FuncionarioModal
          onClose={() => setShowFuncModal(false)}
          onSave={() => { setShowFuncModal(false); mutateUsuarios(); }}
          funcionario={editingFunc}
        />
      )}
      {deletingFunc && (
        <ConfirmDelete
          title="Remover funcionário"
          description={`Tem certeza que deseja remover "${deletingFunc.nome}"? Esta ação não pode ser desfeita.`}
          onClose={() => setDeletingFunc(null)}
          onConfirm={() => handleDeleteFunc(deletingFunc.id)}
        />
      )}
    </div>
  );
}
