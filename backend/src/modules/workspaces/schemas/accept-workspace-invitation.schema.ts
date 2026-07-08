import { z } from "zod";

export const acceptWorkspaceInvitationParamsSchema = z.object({
  token: z.uuid("Token do convite inválido"),
});