import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router";

import { useAuth } from "../../auth/hooks/useAuth";
import {
  updateWorkspaceSchema,
  type UpdateWorkspaceFormData,
} from "../schemas/update-workspace.schema";
import {
  getWorkspaceById,
  updateWorkspace,
} from "../services/workspace.service";
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

  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  const [updateError, setUpdateError] =
    useState<string | null>(null);

  const [updateSuccess, setUpdateSuccess] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<UpdateWorkspaceFormData>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

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

        setWorkspace({
          ...data,
          members: data.members ?? [],
        });
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
    workspace?.members?.find(
      (member) =>
        member.user?.id === user?.id ||
        member.userId === user?.id,
    );

  const canUpdateWorkspace =
    currentMember?.role === "OWNER" ||
    currentMember?.role === "ADMIN";

  function openEditModal() {
    if (!workspace || !canUpdateWorkspace) {
      return;
    }

    setUpdateError(null);
    setUpdateSuccess(null);

    reset({
      name: workspace.name,
      description: workspace.description ?? "",
    });

    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    if (isSubmitting) {
      return;
    }

    setIsEditModalOpen(false);
    setUpdateError(null);
    setUpdateSuccess(null);
  }

  async function handleUpdateWorkspace(
    data: UpdateWorkspaceFormData,
  ) {
    if (!id) {
      setUpdateError("ID do Workspace não informado.");
      return;
    }

    try {
      setUpdateError(null);
      setUpdateSuccess(null);

      const response = await updateWorkspace(id, {
        name: data.name,
        description: data.description.trim(),
      });

      setWorkspace((currentWorkspace) => {
        if (!currentWorkspace) {
          return {
            ...response.workspace,
            members: response.workspace.members ?? [],
          };
        }

        return {
          ...currentWorkspace,
          ...response.workspace,
          members:
            response.workspace.members ??
            currentWorkspace.members ??
            [],
        };
      });

      setUpdateSuccess(response.message);

      window.setTimeout(() => {
        setIsEditModalOpen(false);
        setUpdateSuccess(null);
      }, 800);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro ao atualizar Workspace:", {
          status: error.response?.status,
          data: error.response?.data,
          payload: data,
        });

        const message =
          error.response?.data?.message ??
          "Não foi possível atualizar o Workspace.";

        setUpdateError(message);
        return;
      }

      console.error(
        "Erro inesperado ao atualizar Workspace:",
        error,
      );

      setUpdateError(
        "Ocorreu um erro inesperado ao atualizar o Workspace.",
      );
    }
  }

  function handleRetry() {
    if (!id) {
      return;
    }

    setIsLoading(true);
    setWorkspaceError(null);

    void getWorkspaceById(id)
      .then((data) => {
        setWorkspace({
          ...data,
          members: data.members ?? [],
        });
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
            {workspace.description ||
              "Este Workspace não possui descrição."}
          </p>
        </div>

        <div className="workspace-header-actions">
          {canUpdateWorkspace && (
            <button
              type="button"
              className="primary-button"
              onClick={openEditModal}
            >
              Editar Workspace
            </button>
          )}

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/dashboard")}
          >
            Voltar
          </button>
        </div>
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

      {isEditModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={closeEditModal}
        >
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-workspace-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="modal-header">
              <div>
                <h2 id="edit-workspace-title">
                  Editar Workspace
                </h2>

                <p>
                  Atualize o nome e a descrição do Workspace.
                </p>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeEditModal}
                disabled={isSubmitting}
                aria-label="Fechar modal"
              >
                ×
              </button>
            </header>

            <form
              className="workspace-form"
              onSubmit={handleSubmit(
                handleUpdateWorkspace,
              )}
            >
              <div className="form-field">
                <label htmlFor="edit-workspace-name">
                  Nome
                </label>

                <input
                  id="edit-workspace-name"
                  type="text"
                  autoFocus
                  {...register("name")}
                />

                {errors.name && (
                  <span className="field-error">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="edit-workspace-description">
                  Descrição
                </label>

                <textarea
                  id="edit-workspace-description"
                  rows={4}
                  {...register("description")}
                />

                {errors.description && (
                  <span className="field-error">
                    {errors.description.message}
                  </span>
                )}
              </div>

              {updateError && (
                <div className="api-error" role="alert">
                  {updateError}
                </div>
              )}

              {updateSuccess && (
                <div
                  className="success-message"
                  role="status"
                >
                  {updateSuccess}
                </div>
              )}

              <footer className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeEditModal}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Salvando..."
                    : "Salvar alterações"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}