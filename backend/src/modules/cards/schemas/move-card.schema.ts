import { z } from "zod";

export const moveCardParamsSchema = z.object({
    id: z.uuid(),
});

export const moveCardBodySchema = z.object({
    targetListId: z.uuid(),
    position: z.number().int().min(0),
});

export type MoveCardParams = z.infer<
    typeof moveCardParamsSchema
>;

export type MoveCardBody = z.infer<
    typeof moveCardBodySchema
>;