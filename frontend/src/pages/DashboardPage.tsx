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
  acceptWorkspaceInvitation,
  createWorkspace,
  listPendingWorkspaceInvitations,
  listWorkspaces,
} from "../features/workspaces/services/workspace.service";
import type {
  PendingWorkspaceInvitation,
  Workspace,
} from "../features/workspaces/types/workspace.types";

export function DashboardPage() {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const [isLoadingWorkspaces, setIsLoadingWorkspaces] =
    useState(true);

  const [workspaceError, setWorkspaceError] =
    useState<string | null>(null);

  const [pendingInvitations, setPendingInvitations] =
    useState<PendingWorkspaceInvitation[]>([]);

  const [isLoadingInvitations, setIsLoadingInvitations] =
    useState(true);

  const [invitationsError, setInvitationsError] =
    useState<string | null>(null);

  const [acceptingInvitationId, setAcceptingInvitationId] =
    useState<string | null>(null);

  const [invitationActionError, setInvitationActionError] =
    useState<Record<string, string>>({});

  const [invitationActionSuccess, setInvitationActionSuccess] =
    useState<Record<string, string>>({});

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

  async function loadPendingInvitations() {
    try {
      setIsLoadingInvitations(true);
      setInvitationsError(null);

      const data =
        await listPendingWorkspaceInvitations();

      setPendingInvitations(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Não foi possível carregar os convites pendentes.";

        setInvitationsError(message);
        return;
      }

      setInvitationsError(
        "Ocorreu um erro inesperado ao carregar os convites.",
      );
    } finally {
      setIsLoadingInvitations(false);
    }
  }

  useEffect(() => {
    void Promise.all([
      loadWorkspaces(),
      loadPendingInvitations(),
    ]);
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

  async function handleAcceptInvitation(
    invitation: PendingWorkspaceInvitation,
  ) {
    try {
      setAcceptingInvitationId(invitation.id);

      setInvitationActionError((currentErrors) => {
        const updatedErrors = { ...currentErrors };

        delete updatedErrors[invitation.id];

        return updatedErrors;
      });

      setInvitationActionSuccess((currentSuccess) => {
        const updatedSuccess = { ...currentSuccess };

        delete updatedSuccess[invitation.id];

        return updatedSuccess;
      });

      const response = await acceptWorkspaceInvitation(
        invitation.token,
      );

      setInvitationActionSuccess((currentSuccess) => ({
        ...currentSuccess,
        [invitation.id]: response.message,
      }));

      setPendingInvitations((currentInvitations) =>
        currentInvitations.filter(
          (currentInvitation) =>
            currentInvitation.id !== invitation.id,
        ),
      );

      await loadWorkspaces();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Não foi possível aceitar o convite.";

        setInvitationActionError((currentErrors) => ({
          ...currentErrors,
          [invitation.id]: message,
        }));

        return;
      }

      setInvitationActionError((currentErrors) => ({
        ...currentErrors,
        [invitation.id]:
          "Ocorreu um erro inesperado ao aceitar o convite.",
      }));
    } finally {
      setAcceptingInvitationId(null);
    }
  }

  function formatInvitationExpiration(expiresAt: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(expiresAt));
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-content">
        <section className="pending-invitations-section">
          <div className="dashboard-section-header">
            <div>
              <h2>Convites pendentes</h2>

              <p>
                Aceite convites para participar de novos
                Workspaces.
              </p>
            </div>

            {!isLoadingInvitations && (
              <span className="pending-invitations-count">
                {pendingInvitations.length}{" "}
                {pendingInvitations.length === 1
                  ? "convite"
                  : "convites"}
              </span>
            )}
          </div>

          {isLoadingInvitations && (
            <div
              className="workspace-feedback"
              role="status"
            >
              Carregando convites...
            </div>
          )}

          {!isLoadingInvitations && invitationsError && (
            <div className="pending-invitations-error">
              <div className="api-error" role="alert">
                {invitationsError}
              </div>

              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  void loadPendingInvitations();
                }}
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!isLoadingInvitations &&
            !invitationsError &&
            pendingInvitations.length === 0 && (
              <div className="pending-invitations-empty">
                <h3>Nenhum convite pendente</h3>

                <p>
                  Quando alguém convidar você para um
                  Workspace, o convite aparecerá aqui.
                </p>
              </div>
            )}

          {!isLoadingInvitations &&
            !invitationsError &&
            pendingInvitations.length > 0 && (
              <div className="pending-invitations-list">
                {pendingInvitations.map((invitation) => {
                  const isAccepting =
                    acceptingInvitationId ===
                    invitation.id;

                  const actionError =
                    invitationActionError[
                      invitation.id
                    ];

                  const actionSuccess =
                    invitationActionSuccess[
                      invitation.id
                    ];

                  return (
                    <article
                      className="pending-invitation-card"
                      key={invitation.id}
                    >
                      <div className="pending-invitation-icon">
                        {invitation.workspace.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="pending-invitation-content">
                        <div>
                          <span className="pending-invitation-label">
                            Convite de Workspace
                          </span>

                          <h3>
                            {invitation.workspace.name}
                          </h3>

                          <p>
                            {invitation.workspace
                              .description ??
                              "Este Workspace não possui descrição."}
                          </p>
                        </div>

                        <div className="pending-invitation-details">
                          <span>
                            Convidado por{" "}
                            <strong>
                              {invitation.invitedBy.name}
                            </strong>
                          </span>

                          <span>
                            Expira em{" "}
                            {formatInvitationExpiration(
                              invitation.expiresAt,
                            )}
                          </span>
                        </div>

                        {actionError && (
                          <div
                            className="api-error"
                            role="alert"
                          >
                            {actionError}
                          </div>
                        )}

                        {actionSuccess && (
                          <div
                            className="success-message"
                            role="status"
                          >
                            {actionSuccess}
                          </div>
                        )}
                      </div>

                      <div className="pending-invitation-actions">
                        <button
                          type="button"
                          className="primary-button"
                          disabled={isAccepting}
                          onClick={() => {
                            void handleAcceptInvitation(
                              invitation,
                            );
                          }}
                        >
                          {isAccepting
                            ? "Aceitando..."
                            : "Aceitar convite"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </section>

        <section className="dashboard-workspaces-section">
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
            <div
              className="workspace-feedback"
              role="status"
            >
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
            onMouseDown={(event) =>
              event.stopPropagation()
            }
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
              onSubmit={handleSubmit(
                handleCreateWorkspace,
              )}
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