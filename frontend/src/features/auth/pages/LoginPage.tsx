import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import {
  loginSchema,
  type LoginFormData,
} from "../schemas/login.schema";
import { login } from "../services/auth.service";

export function LoginPage() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(data: LoginFormData) {
    try {
      setApiError(null);

      const response = await login(data);

      localStorage.setItem(
        "@clone-trello:token",
        response.token,
      );

      localStorage.setItem(
        "@clone-trello:user",
        JSON.stringify(response.user),
      );

      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Não foi possível realizar o login.";

        setApiError(message);
        return;
      }

      setApiError("Ocorreu um erro inesperado.");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <header className="auth-header">
          <h1>Clone do Trello</h1>
          <p>Entre para acessar seus Workspaces.</p>
        </header>

        <form
          className="auth-form"
          onSubmit={handleSubmit(handleLogin)}
        >
          <div className="form-field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              {...register("email")}
            />

            {errors.email && (
              <span className="field-error">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="password">Senha</label>

            <input
              id="password"
              type="password"
              placeholder="Sua senha"
              autoComplete="current-password"
              {...register("password")}
            />

            {errors.password && (
              <span className="field-error">
                {errors.password.message}
              </span>
            )}
          </div>

          {apiError && (
            <div className="api-error" role="alert">
              {apiError}
            </div>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="auth-footer">
          Ainda não possui conta?{" "}
          <Link to="/register">Criar conta</Link>
        </p>
      </section>
    </main>
  );
}