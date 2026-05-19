-- CreateTable
CREATE TABLE "Entregador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "placa" TEXT,
    "veiculo" TEXT DEFAULT 'Moto',
    "status" TEXT NOT NULL DEFAULT 'Ativo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Despacho" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedidoId" INTEGER NOT NULL,
    "entregadorId" INTEGER NOT NULL,
    "despachadorId" INTEGER,
    "taxaEntrega" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Aguardando',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Despacho_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Despacho_entregadorId_fkey" FOREIGN KEY ("entregadorId") REFERENCES "Entregador" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Despacho_despachadorId_fkey" FOREIGN KEY ("despachadorId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL DEFAULT 'Açaí Gestor',
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "telefone" TEXT,
    "cargo" TEXT NOT NULL DEFAULT 'Administrador',
    "role" TEXT NOT NULL DEFAULT 'DONO',
    "fotoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Usuario" ("cargo", "createdAt", "email", "fotoUrl", "id", "nome", "senhaHash", "telefone", "updatedAt") SELECT "cargo", "createdAt", "email", "fotoUrl", "id", "nome", "senhaHash", "telefone", "updatedAt" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Despacho_pedidoId_key" ON "Despacho"("pedidoId");
