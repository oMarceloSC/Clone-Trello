import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Informe seu email")
        .email("Informe um email válido")
        .transform((email) => email.toLowerCase()),
});

export type ForgotPasswordFormData = z.infer<
    typeof forgotPasswordSchema
>;