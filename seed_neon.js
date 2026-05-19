require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hash = await bcrypt.hash('acaigo1234', 12);
  
  await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      email: 'Acaigo@acai.com',
      senhaHash: hash,
      role: 'DONO',
      cargo: 'Administrador'
    }
  });

  console.log('Usuário admin criado no PostgreSQL com sucesso!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
