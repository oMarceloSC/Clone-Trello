import { z } from "zod";

export const updateCardParamsSchema = z.object({
    id: z.uuid(),
});

export const updateCardBodySchema = z
    .object({
        title: z.string().trim().min(1).max(100).optional(),

        description: z.string().nullable().optional(),

        dueDate: z.iso.datetime({ offset: true }).nullable().optional(),
    })
    .refine(
        (data) => Object.values(data).some((value) => value !== undefined),
        {
            message: "Informe pelo menos um campo para atualizar.",
        },
    );

export type UpdateCardParams = z.infer<
    typeof updateCardParamsSchema
>;

export type UpdateCardBody = z.infer<
    typeof updateCardBodySchema
>;