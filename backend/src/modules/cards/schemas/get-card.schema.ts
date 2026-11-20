import { z } from "zod";

export const getCardParamsSchema = z.object({
    id: z.uuid(),
});

export type GetCardParams = z.infer<
    typeof getCardParamsSchema
>;