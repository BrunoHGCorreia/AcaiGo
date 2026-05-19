const Database = require('better-sqlite3');
const db = new Database('./dev.db');

try {
  db.exec("ALTER TABLE Usuario ADD COLUMN role TEXT NOT NULL DEFAULT 'DONO'");
  console.log('✅ Coluna role adicionada');
} catch(e) { console.log('role info:', e.message); }

try {
  db.exec(`CREATE TABLE IF NOT EXISTS "Entregador" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "placa" TEXT,
    "veiculo" TEXT DEFAULT 'Moto',
    "status" TEXT NOT NULL DEFAULT 'Ativo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log('✅ Tabela Entregador criada');
} catch(e) { console.log('Entregador erro:', e.message); }

try {
  db.exec(`CREATE TABLE IF NOT EXISTS "Despacho" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "pedidoId" INTEGER NOT NULL UNIQUE,
    "entregadorId" INTEGER NOT NULL,
    "despachadorId" INTEGER,
    "taxaEntrega" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Aguardando',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Despacho_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Despacho_entregadorId_fkey" FOREIGN KEY ("entregadorId") REFERENCES "Entregador" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Despacho_despachadorId_fkey" FOREIGN KEY ("despachadorId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
  )`);
  console.log('✅ Tabela Despacho criada');
} catch(e) { console.log('Despacho erro:', e.message); }

db.close();
console.log('✅ Migração manual concluída!');
