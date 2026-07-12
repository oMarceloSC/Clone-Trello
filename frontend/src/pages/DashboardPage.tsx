import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../features/auth/hooks/useAuth";
import { listWorkspaces } from "../features/workspaces/services/workspace.service";
import type { Workspace } from "../features/workspaces/types/workspace.types";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] =
    useState(true);
  const [workspaceError, setWorkspaceError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadWorkspaces() {
      try {
        setIsLoadingWorkspaces(true);
        setWorkspaceError(null);

        const data = await listWorkspaces();

        setWorkspaces(data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.message ??
            "Não foi possível carregar os Workspaces.";

          setWorkspaceError(message);
          return;
        }

        setWorkspaceError(
          "Ocorreu um erro inesperado ao carregar os Workspaces.",
        );
      } finally {
        setIsLoadingWorkspaces(false);
      }
    }

    void loadWorkspaces();
  }, []);

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
        <div className="dashboard-section-header">
          <div>
            <h2>Seus Workspaces</h2>

            <p>
              Acesse os espaços de trabalho dos quais você faz
              parte.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            disabled
            title="A criação de Workspaces será adicionada na próxima etapa"
          >
            Criar Workspace
          </button>
        </div>

        {isLoadingWorkspaces && (
          <div className="workspace-feedback" role="status">
            Carregando Workspaces...
          </div>
        )}

        {!isLoadingWorkspaces && workspaceError && (
          <div className="api-error" role="alert">
            {workspaceError}
          </div>
        )}

        {!isLoadingWorkspaces &&
          !workspaceError &&
          workspaces.length === 0 && (
            <div className="workspace-empty-state">
              <h3>Nenhum Workspace encontrado</h3>

              <p>
                Você ainda não participa de nenhum Workspace.
              </p>
            </div>
          )}

        {!isLoadingWorkspaces &&
          !workspaceError &&
          workspaces.length > 0 && (
            <div className="workspace-grid">
              {workspaces.map((workspace) => (
                <article
                  className="workspace-card"
                  key={workspace.id}
                >
                  <div className="workspace-card-content">
                    <h3>{workspace.name}</h3>

                    <p>
                      {workspace.description ??
                        "Este Workspace não possui descrição."}
                    </p>
                  </div>

                  <footer className="workspace-card-footer">
                    <span>
                      {workspace.members.length}{" "}
                      {workspace.members.length === 1
                        ? "membro"
                        : "membros"}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/workspaces/${workspace.id}`,
                        )
                      }
                    >
                      Abrir
                    </button>
                  </footer>
                </article>
              ))}
            </div>
          )}
      </section>
    </main>
  );
}