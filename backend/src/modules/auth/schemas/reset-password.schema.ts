import { z } from "zod";

export const resetPasswordSchema = z.object({
  token: z
    .string()
    .trim()
    .min(1, "Token de recuperação não informado"),

  password: z
    .string()
    .min(
      6,
      "A senha deve possuir pelo menos 6 caracteres",
    ),
});

export type ResetPasswordInput = z.infer<
  typeof resetPasswordSchema
>;