import { z } from "zod";

export const updateWorkspaceSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "O nome deve possuir pelo menos 3 caracteres"),

    description: z
        .string()
        .trim()
        .max(500, "A descrição deve possuir no máximo 500 caracteres"),
});

export type UpdateWorkspaceFormData = z.infer<
    typeof updateWorkspaceSchema
>;