-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL DEFAULT 'Açaí Gestor',
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "telefone" TEXT,
    "cargo" TEXT NOT NULL DEFAULT 'Administrador',
    "fotoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Loja" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL DEFAULT 'Açaí Go',
    "cnpj" TEXT DEFAULT '00.000.000/0001-00',
    "endereco" TEXT DEFAULT 'Rua das Frutas, 123',
    "bairro" TEXT DEFAULT 'Centro',
    "cidade" TEXT DEFAULT 'São Paulo',
    "cep" TEXT DEFAULT '01310-000',
    "horarioAbre" TEXT NOT NULL DEFAULT '08:00',
    "horarioFecha" TEXT NOT NULL DEFAULT '22:00'
);

-- CreateTable
CREATE TABLE "Preferencias" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "tema" TEXT NOT NULL DEFAULT 'dark',
    "notifPedidos" BOOLEAN NOT NULL DEFAULT true,
    "notifFinanceiro" BOOLEAN NOT NULL DEFAULT true,
    "notifLeads" BOOLEAN NOT NULL DEFAULT false,
    "notifSistema" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Preferencias_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Preferencias_usuarioId_key" ON "Preferencias"("usuarioId");
