-- Limpa todos os dados de negócio na ordem correta (foreign keys)
-- Preserva: Usuario, Preferencias, Loja

DELETE FROM "ItemPedido";
DELETE FROM "Despacho";
DELETE FROM "Pedido";
DELETE FROM "Cliente";
DELETE FROM "Produto";
DELETE FROM "Lead";
DELETE FROM "Entregador";

-- Reseta sequências de ID para começar do 1
ALTER SEQUENCE "ItemPedido_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Despacho_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Pedido_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Cliente_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Produto_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Lead_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Entregador_id_seq" RESTART WITH 1;
