import { z } from "zod";

export const listWorkspaceMembersParamsSchema = z.object({
    id: z.uuid("ID do Workspace inválido"),
});