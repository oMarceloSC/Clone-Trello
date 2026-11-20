import { z } from "zod";

export const deleteCardParamsSchema = z.object({
    id: z.uuid(),
});

export type DeleteCardParams = z.infer<
    typeof deleteCardParamsSchema
>;