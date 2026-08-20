import { z } from "zod";

export const archiveBoardParamsSchema = z.object({
    id: z.uuid("ID do Board inválido"),
});

export const archiveBoardBodySchema = z.object({
    isArchived: z.boolean(),
});

export type ArchiveBoardParamsInput = z.infer<
    typeof archiveBoardParamsSchema
>;

export type ArchiveBoardBodyInput = z.infer<
    typeof archiveBoardBodySchema
>;