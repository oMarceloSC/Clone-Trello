import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router";

import { useAuth } from "../hooks/useAuth";
import {
  loginSchema,
  type LoginFormData,
} from "../schemas/login.schema";

type LoginLocationState = {
  registrationSuccess?: boolean;
  passwordResetSuccess?: boolean;
};

const SESSION_EXPIRED_STORAGE_KEY =
  "@clone-trello:session-expired";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const state = location.state as LoginLocationState | null;

  const [apiError, setApiError] =
    useState<string | null>(null);

  const [isSessionExpired] = useState(
    () =>
      sessionStorage.getItem(
        SESSION_EXPIRED_STORAGE_KEY,
      ) === "true",
  );

  useEffect(() => {
    if (!isSessionExpired) {
      return;
    }

    sessionStorage.removeItem(
      SESSION_EXPIRED_STORAGE_KEY,
    );
  }, [isSessionExpired]);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
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

      await signIn(data);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Não foi possível realizar o login.";

        setApiError(message);
        return;
      }

      setApiError(
        "Ocorreu um erro inesperado.",
      );
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <header className="auth-header">
          <h1>Clone do Trello</h1>

          <p>
            Entre para acessar seus Workspaces.
          </p>
        </header>

        {state?.registrationSuccess && (
          <div
            className="success-message"
            role="status"
          >
            Conta criada com sucesso.
          </div>
        )}

        {state?.passwordResetSuccess && (
          <div
            className="success-message"
            role="status"
          >
            Senha redefinida com sucesso.
          </div>
        )}

        {isSessionExpired && (
          <div className="api-error" role="alert">
            Sua sessão expirou. Entre novamente.
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit(handleLogin)}
        >
          <div className="form-field">
            <label htmlFor="email">
              Email
            </label>

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
            <label htmlFor="password">
              Senha
            </label>

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

          <div className="forgot-password-link">
            <Link to="/forgot-password">
              Esqueci minha senha
            </Link>
          </div>

          {apiError && (
            <div
              className="api-error"
              role="alert"
            >
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Entrando..."
              : "Entrar"}
          </button>
        </form>

        <p className="auth-footer">
          Ainda não possui conta?{" "}
          <Link to="/register">
            Criar conta
          </Link>
        </p>
      </section>
    </main>
  );
}