import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, "..", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });

const prisma = new PrismaClient({ adapter } as any);

async function main() {
  // ── Clientes ──────────────────────────────────────────────────────────
  const clientes = await Promise.all([
    prisma.cliente.upsert({ where: { email: "joao@email.com" }, update: {}, create: { nome: "João Silva", email: "joao@email.com", telefone: "(11) 99999-1234", status: "Ativo" } }),
    prisma.cliente.upsert({ where: { email: "maria@email.com" }, update: {}, create: { nome: "Maria Oliveira", email: "maria@email.com", telefone: "(11) 98888-5678", status: "Ativo" } }),
    prisma.cliente.upsert({ where: { email: "carlos@email.com" }, update: {}, create: { nome: "Carlos Santos", email: "carlos@email.com", telefone: "(11) 97777-9012", status: "Ativo" } }),
    prisma.cliente.upsert({ where: { email: "ana@email.com" }, update: {}, create: { nome: "Ana Costa", email: "ana@email.com", telefone: "(11) 96666-3456", status: "Inativo" } }),
    prisma.cliente.upsert({ where: { email: "lucas@email.com" }, update: {}, create: { nome: "Lucas Martins", email: "lucas@email.com", telefone: "(11) 95555-7890", status: "Ativo" } }),
    prisma.cliente.upsert({ where: { email: "fern@email.com" }, update: {}, create: { nome: "Fernanda Lima", email: "fern@email.com", telefone: "(11) 94444-2345", status: "Ativo" } }),
    prisma.cliente.upsert({ where: { email: "rob@email.com" }, update: {}, create: { nome: "Roberto Alves", email: "rob@email.com", telefone: "(11) 93333-6789", status: "Inativo" } }),
    prisma.cliente.upsert({ where: { email: "patri@email.com" }, update: {}, create: { nome: "Patrícia Souza", email: "patri@email.com", telefone: "(11) 92222-0123", status: "Ativo" } }),
  ]);

  // ── Produtos ──────────────────────────────────────────────────────────
  const produtos = await Promise.all([
    prisma.produto.upsert({ where: { id: 1 }, update: {}, create: { id: 1, nome: "Açaí 300ml", categoria: "Açaí", preco: 20.0, custo: 8.5, estoque: 45, status: "Ativo", vendas: 98 } }),
    prisma.produto.upsert({ where: { id: 2 }, update: {}, create: { id: 2, nome: "Açaí 500ml", categoria: "Açaí", preco: 29.0, custo: 12.0, estoque: 60, status: "Ativo", vendas: 142 } }),
    prisma.produto.upsert({ where: { id: 3 }, update: {}, create: { id: 3, nome: "Açaí 700ml", categoria: "Açaí", preco: 39.0, custo: 16.5, estoque: 32, status: "Ativo", vendas: 76 } }),
    prisma.produto.upsert({ where: { id: 4 }, update: {}, create: { id: 4, nome: "Açaí 1L", categoria: "Açaí", preco: 58.0, custo: 24.0, estoque: 18, status: "Ativo", vendas: 43 } }),
    prisma.produto.upsert({ where: { id: 5 }, update: {}, create: { id: 5, nome: "Combo 2x 500ml", categoria: "Combo", preco: 78.0, custo: 24.0, estoque: 25, status: "Ativo", vendas: 31 } }),
    prisma.produto.upsert({ where: { id: 6 }, update: {}, create: { id: 6, nome: "Granola Premium", categoria: "Adicional", preco: 5.0, custo: 1.8, estoque: 80, status: "Ativo", vendas: 210 } }),
    prisma.produto.upsert({ where: { id: 7 }, update: {}, create: { id: 7, nome: "Mel Natural", categoria: "Adicional", preco: 4.0, custo: 1.5, estoque: 12, status: "Baixo", vendas: 95 } }),
    prisma.produto.upsert({ where: { id: 8 }, update: {}, create: { id: 8, nome: "Mix de Frutas", categoria: "Adicional", preco: 6.0, custo: 2.5, estoque: 0, status: "Esgotado", vendas: 67 } }),
    prisma.produto.upsert({ where: { id: 9 }, update: {}, create: { id: 9, nome: "Leite Condensado", categoria: "Adicional", preco: 3.5, custo: 1.2, estoque: 55, status: "Ativo", vendas: 130 } }),
    prisma.produto.upsert({ where: { id: 10 }, update: {}, create: { id: 10, nome: "Whey Protein", categoria: "Adicional", preco: 8.0, custo: 4.0, estoque: 8, status: "Baixo", vendas: 28 } }),
  ]);

  // ── Pedidos ───────────────────────────────────────────────────────────
  const pedidoSeedData = [
    { clienteIdx: 0, status: "Concluído", total: 58.9, itens: [{ produtoIdx: 1, qtd: 1 }, { produtoIdx: 5, qtd: 2 }] },
    { clienteIdx: 1, status: "Entrega", total: 42.5, itens: [{ produtoIdx: 0, qtd: 1 }, { produtoIdx: 5, qtd: 1 }] },
    { clienteIdx: 2, status: "Preparo", total: 37.9, itens: [{ produtoIdx: 2, qtd: 1 }] },
    { clienteIdx: 3, status: "Pedido", total: 68.0, itens: [{ produtoIdx: 1, qtd: 2 }] },
    { clienteIdx: 4, status: "Concluído", total: 55.0, itens: [{ produtoIdx: 3, qtd: 1 }, { produtoIdx: 8, qtd: 1 }] },
    { clienteIdx: 5, status: "Concluído", total: 74.7, itens: [{ produtoIdx: 0, qtd: 3 }] },
    { clienteIdx: 6, status: "Concluído", total: 49.9, itens: [{ produtoIdx: 1, qtd: 1 }] },
    { clienteIdx: 7, status: "Entrega", total: 62.5, itens: [{ produtoIdx: 2, qtd: 1 }] },
  ];

  for (const seed of pedidoSeedData) {
    const existing = await prisma.pedido.findFirst({ where: { clienteId: clientes[seed.clienteIdx].id, total: seed.total } });
    if (!existing) {
      await prisma.pedido.create({
        data: {
          clienteId: clientes[seed.clienteIdx].id,
          status: seed.status,
          total: seed.total,
          itens: {
            create: seed.itens.map(i => ({
              produtoId: produtos[i.produtoIdx].id,
              quantidade: i.qtd,
              precoUnit: produtos[i.produtoIdx].preco,
            })),
          },
        },
      });
    }
  }

  // ── Leads ─────────────────────────────────────────────────────────────
  const leadsData = [
    { nome: "Bruno Ferreira", contato: "(11) 99111-2233", fonte: "Instagram", valorEst: 350.0, stage: "Novo" },
    { nome: "Camila Rocha", contato: "(11) 98222-3344", fonte: "Indicação", valorEst: 280.0, stage: "Novo" },
    { nome: "Diego Nunes", contato: "(11) 97333-4455", fonte: "Google", valorEst: 420.0, stage: "Contato" },
    { nome: "Elena Costa", contato: "(11) 96444-5566", fonte: "Instagram", valorEst: 190.0, stage: "Contato" },
    { nome: "Fábio Alves", contato: "(11) 95555-6677", fonte: "Site", valorEst: 560.0, stage: "Proposta" },
    { nome: "Gabi Martins", contato: "(11) 94666-7788", fonte: "Indicação", valorEst: 310.0, stage: "Proposta" },
    { nome: "Hugo Lima", contato: "(11) 93777-8899", fonte: "Google", valorEst: 480.0, stage: "Fechado" },
    { nome: "Iris Santos", contato: "(11) 92888-9900", fonte: "Instagram", valorEst: 225.0, stage: "Fechado" },
  ];

  for (const lead of leadsData) {
    const existing = await prisma.lead.findFirst({ where: { contato: lead.contato } });
    if (!existing) {
      await prisma.lead.create({ data: lead });
    }
  }

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
