import { z } from "zod";

export const inviteWorkspaceMemberParamsSchema = z.object({
  id: z.uuid("ID do Workspace inválido"),
});

export const inviteWorkspaceMemberBodySchema = z.object({
  email: z.string().email("Email inválido"),
});

export type InviteWorkspaceMemberBodyInput = z.infer<
  typeof inviteWorkspaceMemberBodySchema
>;