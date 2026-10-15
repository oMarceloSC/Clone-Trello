import { z } from "zod";

export const updateListParamsSchema = z.object({
    id: z.string().uuid(),
});

export const updateListBodySchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(1, "O título da lista é obrigatório")
            .max(100, "O título da lista deve ter no máximo 100 caracteres"),
    })
    .strict();

export type UpdateListInput = z.infer<
    typeof updateListBodySchema
>;