import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import {
  createWorkspaceSchema,
  type CreateWorkspaceFormData,
} from "../features/workspaces/schemas/create-workspace.schema";
import {
  createWorkspace,
  listWorkspaces,
} from "../features/workspaces/services/workspace.service";
import type { Workspace } from "../features/workspaces/types/workspace.types";

export function DashboardPage() {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] =
    useState(true);
  const [workspaceError, setWorkspaceError] =
    useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);
  const [createWorkspaceError, setCreateWorkspaceError] =
    useState<string | null>(null);
  const [createWorkspaceSuccess, setCreateWorkspaceSuccess] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

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

  function openCreateModal() {
    setCreateWorkspaceError(null);
    setCreateWorkspaceSuccess(null);
    setIsCreateModalOpen(true);
  }

  function closeCreateModal() {
    if (isSubmitting) {
      return;
    }

    setIsCreateModalOpen(false);
    setCreateWorkspaceError(null);
    setCreateWorkspaceSuccess(null);
    reset();
  }

  async function handleCreateWorkspace(
    data: CreateWorkspaceFormData,
  ) {
    try {
      setCreateWorkspaceError(null);
      setCreateWorkspaceSuccess(null);

      const response = await createWorkspace({
        name: data.name,
        description:
          data.description.length > 0
            ? data.description
            : undefined,
      });

      setWorkspaces((currentWorkspaces) => [
        response.workspace,
        ...currentWorkspaces,
      ]);

      setCreateWorkspaceSuccess(response.message);
      reset();

      window.setTimeout(() => {
        setIsCreateModalOpen(false);
        setCreateWorkspaceSuccess(null);
      }, 800);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Não foi possível criar o Workspace.";

        setCreateWorkspaceError(message);
        return;
      }

      setCreateWorkspaceError(
        "Ocorreu um erro inesperado ao criar o Workspace.",
      );
    }
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-content">
        <div className="dashboard-section-header">
          <div>
            <h1>Seus Workspaces</h1>

            <p>
              Acesse e organize seus espaços de trabalho.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={openCreateModal}
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
              <h2>Nenhum Workspace encontrado</h2>

              <p>
                Crie seu primeiro Workspace para começar.
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={openCreateModal}
              >
                Criar primeiro Workspace
              </button>
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
                    <h2>{workspace.name}</h2>

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

      {isCreateModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={closeCreateModal}
        >
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-workspace-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="modal-header">
              <div>
                <h2 id="create-workspace-title">
                  Criar Workspace
                </h2>

                <p>
                  Crie um espaço para organizar seus Boards.
                </p>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeCreateModal}
                disabled={isSubmitting}
                aria-label="Fechar modal"
              >
                ×
              </button>
            </header>

            <form
              className="workspace-form"
              onSubmit={handleSubmit(handleCreateWorkspace)}
            >
              <div className="form-field">
                <label htmlFor="workspace-name">
                  Nome
                </label>

                <input
                  id="workspace-name"
                  type="text"
                  placeholder="Ex.: Projetos pessoais"
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
                <label htmlFor="workspace-description">
                  Descrição
                </label>

                <textarea
                  id="workspace-description"
                  placeholder="Descreva o objetivo deste Workspace"
                  rows={4}
                  {...register("description")}
                />

                {errors.description && (
                  <span className="field-error">
                    {errors.description.message}
                  </span>
                )}
              </div>

              {createWorkspaceError && (
                <div className="api-error" role="alert">
                  {createWorkspaceError}
                </div>
              )}

              {createWorkspaceSuccess && (
                <div
                  className="success-message"
                  role="status"
                >
                  {createWorkspaceSuccess}
                </div>
              )}

              <footer className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeCreateModal}
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
                    ? "Criando..."
                    : "Criar Workspace"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}