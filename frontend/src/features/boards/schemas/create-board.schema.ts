import { z } from "zod";

export const createBoardSchema = z.object({
    title: z
        .string()
        .trim()
        .min(
            3,
            "O título deve possuir pelo menos 3 caracteres",
        ),

        description: z
            .string()
            .trim()
            .optional(),

        backgroundColor: z
            .string()
            .trim()
            .optional(),

        coverImage: z
            .string()
            .trim()
            .optional(),
});

export type CreateBoardFormData = z.infer<
    typeof createBoardSchema
>;