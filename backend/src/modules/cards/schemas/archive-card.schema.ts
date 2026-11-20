import { z } from "zod";

export const archiveCardParamsSchema = z.object({
    id: z.uuid(),
});

export type ArchiveCardParams = z.infer<
    typeof archiveCardParamsSchema
>;