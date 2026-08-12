import { z } from "zod";

export const updateBoardParamsSchema = z.object({
  id: z.uuid("ID do Board inválido"),
});

export const updateBoardBodySchema = z.object({
  title: z
    .string()
    .min(
      3,
      "Título deve ter pelo menos 3 caracteres",
    )
    .optional(),

  description: z.string().optional(),

  backgroundColor: z.string().optional(),

  coverImage: z.string().optional(),
});

export type UpdateBoardParamsInput = z.infer<
  typeof updateBoardParamsSchema
>;

export type UpdateBoardBodyInput = z.infer<
  typeof updateBoardBodySchema
>;