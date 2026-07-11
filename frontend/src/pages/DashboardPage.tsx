import { useNavigate } from "react-router";

import { useAuth } from "../features/auth/hooks/useAuth";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  function handleLogout() {
    signOut();

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Clone do Trello</h1>

          <p>
            Bem-vindo
            {user ? `, ${user.name}` : ""}.
          </p>
        </div>

        <button type="button" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <section className="dashboard-content">
        <h2>Seus Workspaces</h2>

        <p>
          A listagem de Workspaces será adicionada na próxima
          etapa.
        </p>
      </section>
    </main>
  );
}