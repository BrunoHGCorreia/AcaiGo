import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.resolve(__dirname, "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  // ── Admin user ────────────────────────────────────────────────────────
  const existing = await prisma.usuario.findUnique({ where: { email: "admin@acaigo.com.br" } });
  if (!existing) {
    const senhaHash = await bcrypt.hash("acaigo2026", 12);
    const usuario = await prisma.usuario.create({
      data: {
        nome: "Açaí Gestor",
        email: "admin@acaigo.com.br",
        senhaHash,
        telefone: "(11) 99999-0000",
        cargo: "Administrador",
        role: "DONO",
        preferencias: {
          create: {
            tema: "dark",
            notifPedidos: true,
            notifFinanceiro: true,
            notifLeads: false,
            notifSistema: true,
          },
        },
      },
    });
    console.log(`✅ Usuário admin criado: ${usuario.email}`);
    console.log(`   Senha: acaigo2026`);
  } else {
    console.log("ℹ️  Usuário admin já existe");
  }

  // ── Loja padrão ───────────────────────────────────────────────────────
  const lojaExisting = await prisma.loja.findFirst();
  if (!lojaExisting) {
    await prisma.loja.create({
      data: {
        nome: "Açaí Go",
        cnpj: "00.000.000/0001-00",
        endereco: "Rua das Frutas, 123",
        bairro: "Centro",
        cidade: "São Paulo",
        cep: "01310-000",
        horarioAbre: "08:00",
        horarioFecha: "22:00",
      },
    });
    console.log("✅ Loja padrão criada");
  }

  console.log("✅ Seed de auth concluído!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
