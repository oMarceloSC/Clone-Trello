import axios from "axios";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router";

import { useAuth } from "../../auth/hooks/useAuth";
import { getWorkspaceById } from "../services/workspace.service";
import type {
  Workspace,
  WorkspaceMember,
  WorkspaceRole,
} from "../types/workspace.types";

const workspaceRoleLabels: Record<WorkspaceRole, string> = {
  OWNER: "Proprietário",
  ADMIN: "Administrador",
  MEMBER: "Membro",
  VIEWER: "Visualizador",
};

export function WorkspacePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [workspace, setWorkspace] =
    useState<Workspace | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [workspaceError, setWorkspaceError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadWorkspace() {
      if (!id) {
        setWorkspaceError("ID do Workspace não informado.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setWorkspaceError(null);

        const data = await getWorkspaceById(id);

        setWorkspace(data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.message ??
            "Não foi possível carregar o Workspace.";

          setWorkspaceError(message);
          return;
        }

        setWorkspaceError(
          "Ocorreu um erro inesperado ao carregar o Workspace.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadWorkspace();
  }, [id]);

  const currentMember: WorkspaceMember | undefined =
    workspace?.members.find(
      (member) =>
        member.user?.id === user?.id ||
        member.userId === user?.id,
    );

  function handleRetry() {
    if (!id) {
      return;
    }

    setIsLoading(true);
    setWorkspaceError(null);

    void getWorkspaceById(id)
      .then((data) => {
        setWorkspace(data);
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error)) {
          setWorkspaceError(
            error.response?.data?.message ??
              "Não foi possível carregar o Workspace.",
          );

          return;
        }

        setWorkspaceError(
          "Ocorreu um erro inesperado ao carregar o Workspace.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  if (isLoading) {
    return (
      <main className="workspace-page">
        <div className="workspace-page-feedback" role="status">
          Carregando Workspace...
        </div>
      </main>
    );
  }

  if (workspaceError || !workspace) {
    return (
      <main className="workspace-page">
        <div className="workspace-page-error">
          <h1>Não foi possível abrir o Workspace</h1>

          <p>
            {workspaceError ??
              "O Workspace solicitado não foi encontrado."}
          </p>

          <div className="workspace-page-error-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/dashboard")}
            >
              Voltar ao Dashboard
            </button>

            {id && (
              <button
                type="button"
                className="primary-button"
                onClick={handleRetry}
              >
                Tentar novamente
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  const formattedCreatedAt = new Intl.DateTimeFormat(
    "pt-BR",
    {
      dateStyle: "long",
    },
  ).format(new Date(workspace.createdAt));

  return (
    <main className="workspace-page">
      <nav
        className="workspace-breadcrumb"
        aria-label="Navegação estrutural"
      >
        <Link to="/dashboard">Dashboard</Link>

        <span aria-hidden="true">/</span>

        <span>{workspace.name}</span>
      </nav>

      <header className="workspace-page-header">
        <div>
          <span className="workspace-page-label">
            Workspace
          </span>

          <h1>{workspace.name}</h1>

          <p>
            {workspace.description ??
              "Este Workspace não possui descrição."}
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/dashboard")}
        >
          Voltar
        </button>
      </header>

      <section
        className="workspace-summary-grid"
        aria-label="Resumo do Workspace"
      >
        <article className="workspace-summary-card">
          <span>Membros</span>

          <strong>{workspace.members.length}</strong>

          <p>
            {workspace.members.length === 1
              ? "pessoa participa deste Workspace"
              : "pessoas participam deste Workspace"}
          </p>
        </article>

        <article className="workspace-summary-card">
          <span>Sua permissão</span>

          <strong>
            {currentMember
              ? workspaceRoleLabels[currentMember.role]
              : "Não identificada"}
          </strong>

          <p>
            Define as ações disponíveis dentro deste Workspace.
          </p>
        </article>

        <article className="workspace-summary-card">
          <span>Criado em</span>

          <strong>{formattedCreatedAt}</strong>

          <p>Data de criação do espaço de trabalho.</p>
        </article>
      </section>

      <section className="workspace-boards-section">
        <div className="workspace-section-header">
          <div>
            <h2>Boards</h2>

            <p>
              Os quadros deste Workspace serão exibidos aqui.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            disabled
            title="Disponível na Milestone de Boards"
          >
            Criar Board
          </button>
        </div>

        <div className="workspace-boards-empty">
          <div
            className="workspace-boards-empty-icon"
            aria-hidden="true"
          >
            B
          </div>

          <h3>Nenhum Board disponível</h3>

          <p>
            A criação e listagem de Boards serão adicionadas na
            próxima milestone.
          </p>
        </div>
      </section>
    </main>
  );
}