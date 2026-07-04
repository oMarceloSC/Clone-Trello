import { z } from 'zod';

export const getWorkspaceSchema = z.object({
    id: z.uuid("ID do workspace inválido"),
});

export type GetWorkspaceInput = z.infer<typeof getWorkspaceSchema>;