import { z } from "zod";

export const updateWorkspaceParamsSchema = z.object({
  id: z.uuid("ID do Workspace inválido"),
});

export const updateWorkspaceBodySchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").optional(),
  description: z.string().optional(),
});

export type UpdateWorkspaceParamsInput = z.infer<
  typeof updateWorkspaceParamsSchema
>;

export type UpdateWorkspaceBodyInput = z.infer<
  typeof updateWorkspaceBodySchema
>;