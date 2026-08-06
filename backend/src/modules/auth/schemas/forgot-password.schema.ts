import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Informe um email válido")
    .transform((email) => email.toLowerCase()),
});

export type ForgotPasswordInput = z.infer<
  typeof forgotPasswordSchema
>;