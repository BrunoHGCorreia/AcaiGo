/**
 * Script de limpeza do banco de dados
 * Apaga todos os dados de negócio preservando usuários e configurações
 * Executar com: npx tsx prisma/seed-clear.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🗑️  Iniciando limpeza do banco de dados...\n");

  // 1. ItemPedido — depende de Pedido e Produto
  const itemPedidos = await prisma.itemPedido.deleteMany({});
  console.log(`✅ ItemPedido: ${itemPedidos.count} registros removidos`);

  // 2. Despacho — depende de Pedido, Entregador e Usuario
  const despachos = await prisma.despacho.deleteMany({});
  console.log(`✅ Despacho: ${despachos.count} registros removidos`);

  // 3. Pedido — depende de Cliente
  const pedidos = await prisma.pedido.deleteMany({});
  console.log(`✅ Pedido: ${pedidos.count} registros removidos`);

  // 4. Cliente
  const clientes = await prisma.cliente.deleteMany({});
  console.log(`✅ Cliente: ${clientes.count} registros removidos`);

  // 5. Produto
  const produtos = await prisma.produto.deleteMany({});
  console.log(`✅ Produto: ${produtos.count} registros removidos`);

  // 6. Lead
  const leads = await prisma.lead.deleteMany({});
  console.log(`✅ Lead: ${leads.count} registros removidos`);

  // 7. Entregador
  const entregadores = await prisma.entregador.deleteMany({});
  console.log(`✅ Entregador: ${entregadores.count} registros removidos`);

  console.log("\n🎉 Banco limpo! Dados preservados: Usuários, Preferências, Loja.");
  console.log("   Você pode fazer login e começar do zero com seus dados reais.\n");
}

main()
  .catch(e => { console.error("❌ Erro:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
