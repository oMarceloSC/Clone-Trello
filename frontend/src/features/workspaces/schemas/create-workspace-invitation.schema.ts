import { z } from "zod";

export const createWorkspaceInvitationSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Informe o email do usuário")
        .email("Informe um email válido"),
});

export type CreateWorkspaceInvitationFormData = 
    z.infer<typeof createWorkspaceInvitationSchema>;