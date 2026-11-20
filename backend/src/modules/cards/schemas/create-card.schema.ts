import { z } from "zod";

export const createCardParamsSchema = z.object({
    listId: z.uuid(),
});

export const createCardBodySchema = z.object({
    title: z.string().trim().min(1).max(100),
});

export type CreateCardParams = z.infer<typeof createCardParamsSchema>;
export type CreateCardBody = z.infer<typeof createCardBodySchema>;