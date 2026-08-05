import {
  useNavigate,
} from "react-router";

import { useAuth } from "../features/auth/hooks/useAuth";

export function NotFoundPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  function handleGoBack() {
    navigate(-1);
  }

  function handleGoToMainPage() {
    navigate(
      isAuthenticated
        ? "/dashboard"
        : "/login",
      {
        replace: true,
      },
    );
  }

  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <span
          className="not-found-code"
          aria-hidden="true"
        >
          404
        </span>

        <span className="not-found-label">
          Página não encontrada
        </span>

        <h1>
          Não encontramos o endereço solicitado
        </h1>

        <p>
          A página pode ter sido removida, renomeada ou o
          endereço informado está incorreto.
        </p>

        <div className="not-found-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={handleGoBack}
          >
            Voltar
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={handleGoToMainPage}
          >
            {isAuthenticated
              ? "Ir para o Dashboard"
              : "Ir para o Login"}
          </button>
        </div>
      </section>
    </main>
  );
}