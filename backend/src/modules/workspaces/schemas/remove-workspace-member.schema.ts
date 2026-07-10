import { z } from "zod";

export const removeWorkspaceMemberParamsSchema = z.object({
    id: z.uuid("ID do Workspace inválido"),
    memberId: z.string().uuid("ID do membro inválido"),
});