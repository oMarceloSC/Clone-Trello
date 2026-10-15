import { z } from "zod";

export const deleteListParamsSchema = z.object({
    id: z.string().uuid(),
});