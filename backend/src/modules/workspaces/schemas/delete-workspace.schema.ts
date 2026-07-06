import { z } from "zod";

export const deleteWorkspaceParamsSchema = z.object({
  id: z.uuid("ID do Workspace inválido"),
});

export type DeleteWorkspaceParamsInput = z.infer<
  typeof deleteWorkspaceParamsSchema
>;