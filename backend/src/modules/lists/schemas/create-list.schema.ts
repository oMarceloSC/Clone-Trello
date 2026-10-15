import { z } from "zod";

export const createListParamsSchema = z.object({
    boardId: z.string().uuid(),
});

export const createListBodySchema = z.object({
    title: z
        .string()
        .trim()
        .min(1,
            "O título da lista é obrigatório")
        .max(100,
            "O título da lista deve ter no máximo 100 caracteres",),
});

export type CreateListInput = z.infer<
    typeof createListBodySchema>;