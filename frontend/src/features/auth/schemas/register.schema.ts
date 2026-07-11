import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "O nome deve possuir pelo menos 3 caracteres"),

    email: z.email("Informe um email válido"),

    password: z
      .string()
      .min(6, "A senha deve possuir pelo menos 6 caracteres"),

    passwordConfirmation: z
      .string()
      .min(6, "Confirme sua senha"),
  })
  .refine(
    (data) => data.password === data.passwordConfirmation,
    {
      message: "As senhas não coincidem",
      path: ["passwordConfirmation"],
    },
  );

export type RegisterFormData = z.infer<typeof registerSchema>;