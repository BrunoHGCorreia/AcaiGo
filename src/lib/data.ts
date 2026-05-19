// Shared mock data used by GlobalSearch and all pages

export const clientesData = [
  { id: 1, nome: "João Silva", email: "joao@email.com", telefone: "(11) 99999-1234", pedidos: 28, total: "R$ 842,00", ultimo: "Hoje, 14:32", status: "Ativo", initials: "JS" },
  { id: 2, nome: "Maria Oliveira", email: "maria@email.com", telefone: "(11) 98888-5678", pedidos: 15, total: "R$ 523,50", ultimo: "Hoje, 13:10", status: "Ativo", initials: "MO" },
  { id: 3, nome: "Carlos Santos", email: "carlos@email.com", telefone: "(11) 97777-9012", pedidos: 42, total: "R$ 1.340,90", ultimo: "Ontem", status: "Ativo", initials: "CS" },
  { id: 4, nome: "Ana Costa", email: "ana@email.com", telefone: "(11) 96666-3456", pedidos: 7, total: "R$ 189,00", ultimo: "3 dias atrás", status: "Inativo", initials: "AC" },
  { id: 5, nome: "Lucas Martins", email: "lucas@email.com", telefone: "(11) 95555-7890", pedidos: 33, total: "R$ 987,40", ultimo: "Hoje, 11:05", status: "Ativo", initials: "LM" },
  { id: 6, nome: "Fernanda Lima", email: "fern@email.com", telefone: "(11) 94444-2345", pedidos: 19, total: "R$ 614,20", ultimo: "Ontem", status: "Ativo", initials: "FL" },
  { id: 7, nome: "Roberto Alves", email: "rob@email.com", telefone: "(11) 93333-6789", pedidos: 5, total: "R$ 142,00", ultimo: "1 semana", status: "Inativo", initials: "RA" },
  { id: 8, nome: "Patrícia Souza", email: "patri@email.com", telefone: "(11) 92222-0123", pedidos: 61, total: "R$ 2.105,60", ultimo: "Hoje, 09:50", status: "Ativo", initials: "PS" },
];

export const pedidosData = [
  { id: "#1257", cliente: "João Silva", initials: "JS", data: "Hoje, 14:32", itens: "Açaí 500ml, Granola", valor: "R$ 58,90", status: "Concluído" },
  { id: "#1256", cliente: "Maria Oliveira", initials: "MO", data: "Hoje, 14:12", itens: "Açaí 300ml, Frutas", valor: "R$ 42,50", status: "Entrega" },
  { id: "#1255", cliente: "Carlos Santos", initials: "CS", data: "Hoje, 13:45", itens: "Açaí 700ml, Mel", valor: "R$ 37,90", status: "Preparo" },
  { id: "#1254", cliente: "Ana Costa", initials: "AC", data: "Hoje, 13:20", itens: "Açaí 500ml x2", valor: "R$ 68,00", status: "Pedido" },
  { id: "#1253", cliente: "Lucas Martins", initials: "LM", data: "Hoje, 12:58", itens: "Açaí 1L, Leite Condensado", valor: "R$ 55,00", status: "Concluído" },
  { id: "#1252", cliente: "Fernanda Lima", initials: "FL", data: "Hoje, 12:30", itens: "Açaí 300ml x3", valor: "R$ 74,70", status: "Concluído" },
  { id: "#1251", cliente: "Roberto Alves", initials: "RA", data: "Hoje, 11:55", itens: "Açaí 500ml, Whey", valor: "R$ 49,90", status: "Concluído" },
  { id: "#1250", cliente: "Patrícia Souza", initials: "PS", data: "Hoje, 11:20", itens: "Açaí 700ml, Mix Frutas", valor: "R$ 62,50", status: "Entrega" },
];

export const produtosData = [
  { id: 1, nome: "Açaí 300ml", cat: "Açaí", preco: "R$ 20,00", custo: "R$ 8,50", estoque: 45, status: "Ativo", vendas: 98 },
  { id: 2, nome: "Açaí 500ml", cat: "Açaí", preco: "R$ 29,00", custo: "R$ 12,00", estoque: 60, status: "Ativo", vendas: 142 },
  { id: 3, nome: "Açaí 700ml", cat: "Açaí", preco: "R$ 39,00", custo: "R$ 16,50", estoque: 32, status: "Ativo", vendas: 76 },
  { id: 4, nome: "Açaí 1L", cat: "Açaí", preco: "R$ 58,00", custo: "R$ 24,00", estoque: 18, status: "Ativo", vendas: 43 },
  { id: 5, nome: "Combo 2x 500ml", cat: "Combo", preco: "R$ 78,00", custo: "R$ 24,00", estoque: 25, status: "Ativo", vendas: 31 },
  { id: 6, nome: "Granola Premium", cat: "Adicional", preco: "R$ 5,00", custo: "R$ 1,80", estoque: 80, status: "Ativo", vendas: 210 },
  { id: 7, nome: "Mel Natural", cat: "Adicional", preco: "R$ 4,00", custo: "R$ 1,50", estoque: 12, status: "Baixo", vendas: 95 },
  { id: 8, nome: "Mix de Frutas", cat: "Adicional", preco: "R$ 6,00", custo: "R$ 2,50", estoque: 0, status: "Esgotado", vendas: 67 },
  { id: 9, nome: "Leite Condensado", cat: "Adicional", preco: "R$ 3,50", custo: "R$ 1,20", estoque: 55, status: "Ativo", vendas: 130 },
  { id: 10, nome: "Whey Protein", cat: "Adicional", preco: "R$ 8,00", custo: "R$ 4,00", estoque: 8, status: "Baixo", vendas: 28 },
];

export const leadsData = [
  { id: 1, nome: "Bruno Ferreira", contato: "(11) 99111-2233", fonte: "Instagram", valor: "R$ 350,00/mês", data: "Hoje", stage: "Novo", initials: "BF" },
  { id: 2, nome: "Camila Rocha", contato: "(11) 98222-3344", fonte: "Indicação", valor: "R$ 280,00/mês", data: "Hoje", stage: "Novo", initials: "CR" },
  { id: 3, nome: "Diego Nunes", contato: "(11) 97333-4455", fonte: "Google", valor: "R$ 420,00/mês", data: "Ontem", stage: "Contato", initials: "DN" },
  { id: 4, nome: "Elena Costa", contato: "(11) 96444-5566", fonte: "Instagram", valor: "R$ 190,00/mês", data: "Ontem", stage: "Contato", initials: "EC" },
];
