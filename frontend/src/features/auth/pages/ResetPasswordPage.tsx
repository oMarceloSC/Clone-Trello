import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router";

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../schemas/reset-password.schema";
import { resetPassword } from "../services/auth.service";

export function ResetPasswordPage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [apiError, setApiError] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  async function handleResetPassword(
    data: ResetPasswordFormData,
  ) {
    if (!token) {
      setApiError(
        "Token de recuperação não informado.",
      );

      return;
    }

    try {
      setApiError(null);
      setSuccessMessage(null);

      const response = await resetPassword({
        token,
        password: data.password,
      });

      setSuccessMessage(response.message);

      window.setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            passwordResetSuccess: true,
          },
        });
      }, 1200);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Não foi possível redefinir a senha.";

        setApiError(message);
        return;
      }

      setApiError(
        "Ocorreu um erro inesperado ao redefinir a senha.",
      );
    }
  }

  if (!token) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <header className="auth-header">
            <h1>Link inválido</h1>

            <p>
              O link de redefinição não possui um token
              válido.
            </p>
          </header>

          <div className="api-error" role="alert">
            Token de recuperação não informado.
          </div>

          <p className="auth-footer">
            <Link to="/forgot-password">
              Solicitar um novo link
            </Link>
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <header className="auth-header">
          <h1>Redefinir senha</h1>

          <p>
            Informe e confirme sua nova senha.
          </p>
        </header>

        <form
          className="auth-form"
          onSubmit={handleSubmit(
            handleResetPassword,
          )}
        >
          <div className="form-field">
            <label htmlFor="reset-password">
              Nova senha
            </label>

            <input
              id="reset-password"
              type="password"
              placeholder="Sua nova senha"
              autoComplete="new-password"
              autoFocus
              {...register("password")}
            />

            {errors.password && (
              <span className="field-error">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="reset-password-confirmation">
              Confirmar nova senha
            </label>

            <input
              id="reset-password-confirmation"
              type="password"
              placeholder="Confirme sua nova senha"
              autoComplete="new-password"
              {...register("passwordConfirmation")}
            />

            {errors.passwordConfirmation && (
              <span className="field-error">
                {
                  errors.passwordConfirmation
                    .message
                }
              </span>
            )}
          </div>

          {apiError && (
            <div className="api-error" role="alert">
              {apiError}
            </div>
          )}

          {successMessage && (
            <div
              className="success-message"
              role="status"
            >
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={
              isSubmitting ||
              Boolean(successMessage)
            }
          >
            {isSubmitting
              ? "Redefinindo..."
              : "Redefinir senha"}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login">
            Voltar para o Login
          </Link>
        </p>
      </section>
    </main>
  );
}