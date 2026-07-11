import { useNavigate } from "react-router";

import type { User } from "../features/auth/types/auth.types";

export function DashboardPage() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem(
    "@clone-trello:user",
  );

  const user: User | null = storedUser
    ? JSON.parse(storedUser)
    : null;

  function handleLogout() {
    localStorage.removeItem("@clone-trello:token");
    localStorage.removeItem("@clone-trello:user");

    navigate("/login");
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