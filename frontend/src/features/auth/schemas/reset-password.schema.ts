import { z } from "zod";

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(
                6,
                "A senha deve possuir pelo menos 6 caracteres",
            ),

            passwordConfirmation: z
                .string()
                .min(1, "Confirme a nova senha"),
    })
    .refine(
        (data) =>
            data.password === data.passwordConfirmation,
        {
            message: "As senhas não coincidem",
            path: ["passwordConfirmation"],
        },
    );

export type ResetPasswordFormData = z.infer<
    typeof resetPasswordSchema
>;