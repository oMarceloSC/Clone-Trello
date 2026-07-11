import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/register.schema";
import { registerUser } from "../services/auth.service";

export function RegisterPage() {
  const navigate = useNavigate();

  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  async function handleRegister(data: RegisterFormData) {
    try {
      setApiError(null);

      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      navigate("/login", {
        replace: true,
        state: {
          registrationSuccess: true,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Não foi possível criar sua conta.";

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
          <h1>Criar conta</h1>

          <p>
            Cadastre-se para organizar seus projetos e tarefas.
          </p>
        </header>

        <form
          className="auth-form"
          onSubmit={handleSubmit(handleRegister)}
        >
          <div className="form-field">
            <label htmlFor="name">Nome</label>

            <input
              id="name"
              type="text"
              placeholder="Seu nome"
              autoComplete="name"
              {...register("name")}
            />

            {errors.name && (
              <span className="field-error">
                {errors.name.message}
              </span>
            )}
          </div>

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
              placeholder="Crie uma senha"
              autoComplete="new-password"
              {...register("password")}
            />

            {errors.password && (
              <span className="field-error">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="passwordConfirmation">
              Confirmar senha
            </label>

            <input
              id="passwordConfirmation"
              type="password"
              placeholder="Digite a senha novamente"
              autoComplete="new-password"
              {...register("passwordConfirmation")}
            />

            {errors.passwordConfirmation && (
              <span className="field-error">
                {errors.passwordConfirmation.message}
              </span>
            )}
          </div>

          {apiError && (
            <div className="api-error" role="alert">
              {apiError}
            </div>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Criando conta..."
              : "Criar conta"}
          </button>
        </form>

        <p className="auth-footer">
          Já possui uma conta?{" "}
          <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}