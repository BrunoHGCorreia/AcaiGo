// ─── AÇAÍ GO — Demo Data ──────────────────────────────────────────────────────
// Dados fictícios usados no modo demonstração (sem login)
// Estes dados NUNCA são salvos no banco. Apenas visuais.

export const DEMO_MODE_BANNER = true;

// ─── Clientes ─────────────────────────────────────────────────────────────────
export const demoClientes = [
  { id: 1, nome: "João Silva", email: "joao.silva@email.com", telefone: "(11) 99123-4567", status: "Ativo", createdAt: "2025-03-10T10:00:00Z", _count: { pedidos: 12 } },
  { id: 2, nome: "Maria Oliveira", email: "maria.oliveira@email.com", telefone: "(11) 98765-4321", status: "Ativo", createdAt: "2025-02-14T09:30:00Z", _count: { pedidos: 8 } },
  { id: 3, nome: "Carlos Santos", email: "carlos.santos@email.com", telefone: "(21) 97654-3210", status: "Ativo", createdAt: "2025-01-20T14:00:00Z", _count: { pedidos: 5 } },
  { id: 4, nome: "Ana Costa", email: "ana.costa@email.com", telefone: "(31) 96543-2109", status: "Inativo", createdAt: "2025-04-05T11:15:00Z", _count: { pedidos: 2 } },
  { id: 5, nome: "Lucas Martins", email: "lucas.martins@email.com", telefone: "(11) 95432-1098", status: "Ativo", createdAt: "2025-05-01T08:45:00Z", _count: { pedidos: 20 } },
  { id: 6, nome: "Fernanda Lima", email: "fernanda.lima@email.com", telefone: "(41) 94321-0987", status: "Ativo", createdAt: "2025-04-18T16:20:00Z", _count: { pedidos: 7 } },
  { id: 7, nome: "Rafael Souza", email: "rafael.souza@email.com", telefone: "(51) 93210-9876", status: "Ativo", createdAt: "2025-03-28T13:40:00Z", _count: { pedidos: 15 } },
];

// ─── Produtos ─────────────────────────────────────────────────────────────────
export const demoProdutos = [
  { id: 1, nome: "Açaí Tradicional 300ml", cat: "Açaí", categoria: "Açaí", preco: 14.90, estoque: 150, status: "Ativo", descricao: "Açaí batido na hora com guaraná", createdAt: "2025-01-01T00:00:00Z" },
  { id: 2, nome: "Açaí Especial 500ml", cat: "Açaí", categoria: "Açaí", preco: 22.90, estoque: 80, status: "Ativo", descricao: "Açaí cremoso com frutas selecionadas", createdAt: "2025-01-01T00:00:00Z" },
  { id: 3, nome: "Açaí Família 1L", cat: "Açaí", categoria: "Açaí", preco: 39.90, estoque: 45, status: "Ativo", descricao: "Porção família para compartilhar", createdAt: "2025-01-01T00:00:00Z" },
  { id: 4, nome: "Granola Premium", cat: "Complemento", categoria: "Complemento", preco: 5.00, estoque: 200, status: "Ativo", descricao: "Granola artesanal crocante", createdAt: "2025-01-01T00:00:00Z" },
  { id: 5, nome: "Leite Condensado", cat: "Complemento", categoria: "Complemento", preco: 3.00, estoque: 300, status: "Ativo", descricao: "Cobertura de leite condensado", createdAt: "2025-01-01T00:00:00Z" },
  { id: 6, nome: "Combo Duplo", cat: "Combo", categoria: "Combo", preco: 42.00, estoque: 30, status: "Ativo", descricao: "2 açaís 300ml + granola + banana", createdAt: "2025-01-01T00:00:00Z" },
];

// ─── Pedidos ──────────────────────────────────────────────────────────────────
export const demoPedidos = [
  { id: 1257, status: "Concluído", total: 58.90, createdAt: "2025-05-23T14:32:00Z", cliente: { nome: "João Silva" }, itens: [{ produto: { nome: "Açaí Especial 500ml" }, quantidade: 2 }, { produto: { nome: "Granola Premium" }, quantidade: 1 }] },
  { id: 1256, status: "Entrega", total: 42.50, createdAt: "2025-05-23T14:12:00Z", cliente: { nome: "Maria Oliveira" }, itens: [{ produto: { nome: "Açaí Tradicional 300ml" }, quantidade: 2 }, { produto: { nome: "Leite Condensado" }, quantidade: 1 }] },
  { id: 1255, status: "Preparo", total: 37.90, createdAt: "2025-05-23T13:45:00Z", cliente: { nome: "Carlos Santos" }, itens: [{ produto: { nome: "Açaí Família 1L" }, quantidade: 1 }] },
  { id: 1254, status: "Pedido", total: 68.00, createdAt: "2025-05-23T13:20:00Z", cliente: { nome: "Ana Costa" }, itens: [{ produto: { nome: "Combo Duplo" }, quantidade: 1 }, { produto: { nome: "Granola Premium" }, quantidade: 2 }] },
  { id: 1253, status: "Concluído", total: 55.00, createdAt: "2025-05-23T12:58:00Z", cliente: { nome: "Lucas Martins" }, itens: [{ produto: { nome: "Açaí Especial 500ml" }, quantidade: 2 }, { produto: { nome: "Leite Condensado" }, quantidade: 2 }] },
  { id: 1252, status: "Concluído", total: 29.90, createdAt: "2025-05-23T12:15:00Z", cliente: { nome: "Fernanda Lima" }, itens: [{ produto: { nome: "Açaí Tradicional 300ml" }, quantidade: 2 }] },
  { id: 1251, status: "Concluído", total: 84.00, createdAt: "2025-05-23T11:40:00Z", cliente: { nome: "Rafael Souza" }, itens: [{ produto: { nome: "Açaí Família 1L" }, quantidade: 2 }, { produto: { nome: "Granola Premium" }, quantidade: 1 }] },
  { id: 1250, status: "Entrega", total: 22.90, createdAt: "2025-05-23T11:00:00Z", cliente: { nome: "João Silva" }, itens: [{ produto: { nome: "Açaí Especial 500ml" }, quantidade: 1 }] },
];

// ─── Leads ────────────────────────────────────────────────────────────────────
export const demoLeads = [
  { id: 1, nome: "Pedro Alves", email: "pedro.alves@email.com", telefone: "(11) 98111-2222", fonte: "Instagram", stage: "Qualificado", valor: "R$ 500,00", createdAt: "2025-05-20T10:00:00Z", initials: "PA" },
  { id: 2, nome: "Camila Rodrigues", email: "camila.r@email.com", telefone: "(21) 97222-3333", fonte: "WhatsApp", stage: "Proposta", valor: "R$ 1.200,00", createdAt: "2025-05-18T14:30:00Z", initials: "CR" },
  { id: 3, nome: "Bruno Ferreira", email: "b.ferreira@email.com", telefone: "(31) 96333-4444", fonte: "Indicação", stage: "Contato", valor: "R$ 800,00", createdAt: "2025-05-15T09:00:00Z", initials: "BF" },
  { id: 4, nome: "Juliana Nunes", email: "ju.nunes@email.com", telefone: "(41) 95444-5555", fonte: "Google", stage: "Fechado", valor: "R$ 2.400,00", createdAt: "2025-05-10T16:00:00Z", initials: "JN" },
];

// ─── Entregadores ─────────────────────────────────────────────────────────────
export const demoEntregadores = [
  { id: 1, nome: "Marcos Entregador", telefone: "(11) 94567-8901", veiculo: "Moto Honda CG 160", placa: "ABC-1234", status: "Ativo", totalEntregas: 48, createdAt: "2025-01-15T00:00:00Z" },
  { id: 2, nome: "Diego Courier", telefone: "(11) 93456-7890", veiculo: "Moto Yamaha Factor", placa: "DEF-5678", status: "Ativo", totalEntregas: 32, createdAt: "2025-02-01T00:00:00Z" },
  { id: 3, nome: "Felipe Speed", telefone: "(11) 92345-6789", veiculo: "Bicicleta Elétrica", placa: "—", status: "Inativo", totalEntregas: 15, createdAt: "2025-03-10T00:00:00Z" },
];

// ─── Gráficos ─────────────────────────────────────────────────────────────────
export const demoRevenueByHour = [
  { hour: "8h", value: 120 }, { hour: "9h", value: 340 }, { hour: "10h", value: 580 },
  { hour: "11h", value: 920 }, { hour: "12h", value: 1640 }, { hour: "13h", value: 1980 },
  { hour: "14h", value: 2200 }, { hour: "15h", value: 1850 }, { hour: "16h", value: 2458 },
];

export const demoRevenueByWeek = [
  { day: "Seg", value: 1820 }, { day: "Ter", value: 2340 }, { day: "Qua", value: 1980 },
  { day: "Qui", value: 2760 }, { day: "Sex", value: 3100 }, { day: "Sáb", value: 3840 }, { day: "Dom", value: 2200 },
];

export const demoFinanceiroFluxo = [
  { mes: "Dez", receita: 15200, despesa: 5300 }, { mes: "Jan", receita: 18200, despesa: 6800 },
  { mes: "Fev", receita: 21400, despesa: 7200 }, { mes: "Mar", receita: 19800, despesa: 8100 },
  { mes: "Abr", receita: 24600, despesa: 7500 }, { mes: "Mai", receita: 28300, despesa: 9200 },
];

export const demoStatusPedidos = { Pedido: 6, Preparo: 12, Entrega: 18, "Concluído": 42 };

export const demoKpis = {
  faturamentoHoje: 2458.90,
  pedidosHoje: 78,
  novosClientes: 12,
  totalClientes: 247,
  ticketMedio: 31.52,
};

// ─── Utilitários ──────────────────────────────────────────────────────────────
export function isDemoMode(usuario: { id: number } | null): boolean {
  return usuario === null;
}
