import { z } from "zod";

export const listCardsParamsSchema = z.object({
    listId: z.uuid(),
});

export type ListCardsParams = z.infer<
    typeof listCardsParamsSchema
>;