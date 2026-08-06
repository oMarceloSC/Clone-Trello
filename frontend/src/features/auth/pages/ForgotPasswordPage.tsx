import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../schemas/forgot-password.schema";
import { forgotPassword } from "../services/auth.service";

export function ForgotPasswordPage() {
  const [apiError, setApiError] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const [resetUrl, setResetUrl] =
    useState<string | null>(null);

  const [copyMessage, setCopyMessage] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleForgotPassword(
    data: ForgotPasswordFormData,
  ) {
    try {
      setApiError(null);
      setSuccessMessage(null);
      setResetUrl(null);
      setCopyMessage(null);

      const response = await forgotPassword(data);

      setSuccessMessage(response.message);
      setResetUrl(response.resetUrl);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Não foi possível solicitar a recuperação da senha.";

        setApiError(message);
        return;
      }

      setApiError(
        "Ocorreu um erro inesperado ao solicitar a recuperação.",
      );
    }
  }

  async function handleCopyResetUrl() {
    if (!resetUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(resetUrl);

      setCopyMessage(
        "Link copiado para a área de transferência.",
      );
    } catch {
      setCopyMessage(
        "Não foi possível copiar o link automaticamente.",
      );
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <header className="auth-header">
          <h1>Recuperar senha</h1>

          <p>
            Informe seu email para gerar as instruções de
            recuperação.
          </p>
        </header>

        <form
          className="auth-form"
          onSubmit={handleSubmit(
            handleForgotPassword,
          )}
        >
          <div className="form-field">
            <label htmlFor="forgot-password-email">
              Email
            </label>

            <input
              id="forgot-password-email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              autoFocus
              {...register("email")}
            />

            {errors.email && (
              <span className="field-error">
                {errors.email.message}
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

          {resetUrl && (
            <section className="password-reset-link-section">
              <p>
                Nesta versão de desenvolvimento, utilize o
                link abaixo para redefinir a senha:
              </p>

              <div className="password-reset-link-control">
                <input
                  type="text"
                  value={resetUrl}
                  readOnly
                  aria-label="Link de redefinição de senha"
                />

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    void handleCopyResetUrl();
                  }}
                >
                  Copiar
                </button>
              </div>

              {copyMessage && (
                <span
                  className="password-reset-copy-message"
                  role="status"
                >
                  {copyMessage}
                </span>
              )}

              <Link
                className="primary-button password-reset-open-link"
                to={resetUrl}
              >
                Redefinir senha
              </Link>
            </section>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Enviando..."
              : "Solicitar recuperação"}
          </button>
        </form>

        <p className="auth-footer">
          Lembrou sua senha?{" "}
          <Link to="/login">
            Voltar para o Login
          </Link>
        </p>
      </section>
    </main>
  );
}