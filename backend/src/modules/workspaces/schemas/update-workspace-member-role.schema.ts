import { z } from "zod";

export const updateWorkspaceMemberRoleParamsSchema = z.object({
  id: z.uuid("ID do Workspace inválido"),
  memberId: z.uuid("ID do membro inválido"),
});

export const updateWorkspaceMemberRoleBodySchema = z.object({
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
});