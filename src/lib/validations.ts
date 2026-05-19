import { z } from "zod";

export const clienteSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  status: z.enum(["Ativo", "Inativo"]).default("Ativo"),
});

export const produtoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  categoria: z.string().min(1, "Categoria obrigatória"),
  preco: z.number().positive("Preço deve ser positivo"),
  custo: z.number().positive("Custo deve ser positivo"),
  estoque: z.number().int().min(0, "Estoque não pode ser negativo"),
  status: z.enum(["Ativo", "Baixo", "Esgotado"]).default("Ativo"),
});

export const pedidoSchema = z.object({
  clienteId: z.number().int().positive(),
  status: z.enum(["Pedido", "Preparo", "Entrega", "Concluído"]).default("Pedido"),
  itens: z.array(
    z.object({
      produtoId: z.number().int().positive(),
      quantidade: z.number().int().positive(),
      precoUnit: z.number().positive(),
    })
  ).min(1, "Pedido deve ter ao menos 1 item"),
});

export const pedidoStatusSchema = z.object({
  status: z.enum(["Pedido", "Preparo", "Entrega", "Concluído"]),
});

export const leadSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  contato: z.string().min(5, "Contato obrigatório"),
  fonte: z.string().min(1, "Fonte obrigatória"),
  valorEst: z.number().optional(),
  stage: z.enum(["Novo", "Contato", "Proposta", "Fechado"]).default("Novo"),
});

export const leadStageSchema = z.object({
  stage: z.enum(["Novo", "Contato", "Proposta", "Fechado"]),
});

export type ClienteInput = z.infer<typeof clienteSchema>;
export type ProdutoInput = z.infer<typeof produtoSchema>;
export type PedidoInput = z.infer<typeof pedidoSchema>;
export type LeadInput = z.infer<typeof leadSchema>;
