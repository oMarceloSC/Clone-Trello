import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router";

import {
  createBoardSchema,
  type CreateBoardFormData,
} from "../../boards/schemas/create-board.schema";

import {
  archiveBoard,
  createBoard,
  listArchivedBoards,
  listBoards,
} from "../../boards/services/board.service";

import type { Board } from "../../boards/types/board.types";

import { useAuth } from "../../auth/hooks/useAuth";

import { WorkspaceMembersSection } from "../components/WorkspaceMembersSection";

import {
  updateWorkspaceSchema,
  type UpdateWorkspaceFormData,
} from "../schemas/update-workspace.schema";

import {
  deleteWorkspace,
  getWorkspaceById,
  updateWorkspace,
} from "../services/workspace.service";

import type {
  Workspace,
  WorkspaceMember,
  WorkspaceRole,
} from "../types/workspace.types";

const workspaceRoleLabels: Record<
  WorkspaceRole,
  string
> = {
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

  const [isLoading, setIsLoading] =
    useState(true);

  const [workspaceError, setWorkspaceError] =
    useState<string | null>(null);

  const [boards, setBoards] =
    useState<Board[]>([]);

  const [
    isLoadingBoards,
    setIsLoadingBoards,
  ] = useState(true);

  const [boardsError, setBoardsError] =
    useState<string | null>(null);

  const [
    archivedBoards,
    setArchivedBoards,
  ] = useState<Board[]>([]);

  const [
    isArchivedBoardsOpen,
    setIsArchivedBoardsOpen,
  ] = useState(false);

  const [
    isLoadingArchivedBoards,
    setIsLoadingArchivedBoards,
  ] = useState(false);

  const [
    archivedBoardsError,
    setArchivedBoardsError,
  ] = useState<string | null>(null);

  const [
    restoringBoardId,
    setRestoringBoardId,
  ] = useState<string | null>(null);

  const [
    restoreBoardError,
    setRestoreBoardError,
  ] = useState<string | null>(null);

  const [
    restoreBoardSuccess,
    setRestoreBoardSuccess,
  ] = useState<string | null>(null);

  const [
    isCreateBoardModalOpen,
    setIsCreateBoardModalOpen,
  ] = useState(false);

  const [
    createBoardError,
    setCreateBoardError,
  ] = useState<string | null>(null);

  const [
    createBoardSuccess,
    setCreateBoardSuccess,
  ] = useState<string | null>(null);

  const [
    isEditModalOpen,
    setIsEditModalOpen,
  ] = useState(false);

  const [updateError, setUpdateError] =
    useState<string | null>(null);

  const [updateSuccess, setUpdateSuccess] =
    useState<string | null>(null);

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState<string | null>(null);

  const [deleteSuccess, setDeleteSuccess] =
    useState<string | null>(null);

  const {
    register: registerWorkspaceUpdate,
    handleSubmit:
      handleWorkspaceUpdateSubmit,
    reset: resetWorkspaceUpdate,
    formState: {
      errors: workspaceUpdateErrors,
      isSubmitting:
        isUpdatingWorkspace,
    },
  } = useForm<UpdateWorkspaceFormData>({
    resolver: zodResolver(
      updateWorkspaceSchema,
    ),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const {
    register: registerBoard,
    handleSubmit: handleBoardSubmit,
    reset: resetBoardForm,
    formState: {
      errors: boardFormErrors,
      isSubmitting: isCreatingBoard,
    },
  } = useForm<CreateBoardFormData>({
    resolver: zodResolver(
      createBoardSchema,
    ),
    defaultValues: {
      title: "",
      description: "",
      backgroundColor: "#0c66e4",
      coverImage: "",
    },
  });

  useEffect(() => {
    async function loadWorkspace() {
      if (!id) {
        setWorkspaceError(
          "ID do Workspace não informado.",
        );

        setIsLoading(false);

        return;
      }

      try {
        setIsLoading(true);

        setWorkspaceError(null);

        const data =
          await getWorkspaceById(id);

        setWorkspace({
          ...data,
          members:
            data.members ?? [],
        });
      } catch (error) {
        if (
          axios.isAxiosError(error)
        ) {
          const message =
            error.response?.data
              ?.message ??
            "Não foi possível carregar o Workspace.";

          setWorkspaceError(
            message,
          );

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

  useEffect(() => {
    async function loadBoards() {
      if (!id) {
        setBoardsError(
          "ID do Workspace não informado.",
        );

        setIsLoadingBoards(false);

        return;
      }

      try {
        setIsLoadingBoards(true);

        setBoardsError(null);

        const data =
          await listBoards(id);

        setBoards(data);
      } catch (error) {
        if (
          axios.isAxiosError(error)
        ) {
          const message =
            error.response?.data
              ?.message ??
            "Não foi possível carregar os Boards.";

          setBoardsError(message);

          return;
        }

        setBoardsError(
          "Ocorreu um erro inesperado ao carregar os Boards.",
        );
      } finally {
        setIsLoadingBoards(false);
      }
    }

    void loadBoards();
  }, [id]);

  const currentMember:
    | WorkspaceMember
    | undefined =
    workspace?.members?.find(
      (member) =>
        member.user?.id ===
          user?.id ||
        member.userId ===
          user?.id,
    );

  const canUpdateWorkspace =
    currentMember?.role ===
      "OWNER" ||
    currentMember?.role ===
      "ADMIN";

  const canDeleteWorkspace =
    currentMember?.role ===
    "OWNER";

  const canCreateBoard =
    currentMember?.role ===
      "OWNER" ||
    currentMember?.role ===
      "ADMIN" ||
    currentMember?.role ===
      "MEMBER";

  function openEditModal() {
    if (
      !workspace ||
      !canUpdateWorkspace
    ) {
      return;
    }

    setUpdateError(null);

    setUpdateSuccess(null);

    resetWorkspaceUpdate({
      name: workspace.name,
      description:
        workspace.description ??
        "",
    });

    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    if (
      isUpdatingWorkspace
    ) {
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
      setUpdateError(
        "ID do Workspace não informado.",
      );

      return;
    }

    try {
      setUpdateError(null);

      setUpdateSuccess(null);

      const response =
        await updateWorkspace(id, {
          name: data.name,
          description:
            data.description.trim(),
        });

      setWorkspace(
        (
          currentWorkspace,
        ) => {
          if (
            !currentWorkspace
          ) {
            return {
              ...response.workspace,

              members:
                response.workspace
                  .members ?? [],
            };
          }

          return {
            ...currentWorkspace,

            ...response.workspace,

            members:
              response.workspace
                .members ??
              currentWorkspace.members ??
              [],
          };
        },
      );

      setUpdateSuccess(
        response.message,
      );

      window.setTimeout(
        () => {
          setIsEditModalOpen(
            false,
          );

          setUpdateSuccess(
            null,
          );
        },
        800,
      );
    } catch (error) {
      if (
        axios.isAxiosError(error)
      ) {
        const message =
          error.response?.data
            ?.message ??
          "Não foi possível atualizar o Workspace.";

        setUpdateError(
          message,
        );

        return;
      }

      setUpdateError(
        "Ocorreu um erro inesperado ao atualizar o Workspace.",
      );
    }
  }

  function openCreateBoardModal() {
    if (!canCreateBoard) {
      return;
    }

    setCreateBoardError(null);

    setCreateBoardSuccess(null);

    resetBoardForm({
      title: "",
      description: "",
      backgroundColor:
        "#0c66e4",
      coverImage: "",
    });

    setIsCreateBoardModalOpen(
      true,
    );
  }

  function closeCreateBoardModal() {
    if (isCreatingBoard) {
      return;
    }

    setIsCreateBoardModalOpen(
      false,
    );

    setCreateBoardError(null);

    setCreateBoardSuccess(null);

    resetBoardForm({
      title: "",
      description: "",
      backgroundColor:
        "#0c66e4",
      coverImage: "",
    });
  }

  async function handleCreateBoard(
    data: CreateBoardFormData,
  ) {
    if (!id) {
      setCreateBoardError(
        "ID do Workspace não informado.",
      );

      return;
    }

    try {
      setCreateBoardError(null);

      setCreateBoardSuccess(null);

      const response =
        await createBoard(id, {
          title: data.title,

          description:
            data.description &&
            data.description
              .length > 0
              ? data.description
              : undefined,

          backgroundColor:
            data.backgroundColor &&
            data.backgroundColor
              .length > 0
              ? data.backgroundColor
              : undefined,

          coverImage:
            data.coverImage &&
            data.coverImage
              .length > 0
              ? data.coverImage
              : undefined,
        });

      setBoards(
        (currentBoards) => [
          response.board,
          ...currentBoards,
        ],
      );

      setCreateBoardSuccess(
        response.message,
      );

      window.setTimeout(
        () => {
          setIsCreateBoardModalOpen(
            false,
          );

          setCreateBoardSuccess(
            null,
          );

          resetBoardForm({
            title: "",
            description: "",
            backgroundColor:
              "#0c66e4",
            coverImage: "",
          });
        },
        800,
      );
    } catch (error) {
      if (
        axios.isAxiosError(error)
      ) {
        const message =
          error.response?.data
            ?.message ??
          "Não foi possível criar o Board.";

        setCreateBoardError(
          message,
        );

        return;
      }

      setCreateBoardError(
        "Ocorreu um erro inesperado ao criar o Board.",
      );
    }
  }

  async function handleRetryBoards() {
    if (!id) {
      return;
    }

    try {
      setIsLoadingBoards(true);

      setBoardsError(null);

      const data =
        await listBoards(id);

      setBoards(data);
    } catch (error) {
      if (
        axios.isAxiosError(error)
      ) {
        setBoardsError(
          error.response?.data
            ?.message ??
            "Não foi possível carregar os Boards.",
        );

        return;
      }

      setBoardsError(
        "Ocorreu um erro inesperado ao carregar os Boards.",
      );
    } finally {
      setIsLoadingBoards(
        false,
      );
    }
  }

  async function handleOpenArchivedBoards() {
    if (!id) {
      return;
    }

    if (
      isArchivedBoardsOpen
    ) {
      setIsArchivedBoardsOpen(
        false,
      );

      return;
    }

    try {
      setIsArchivedBoardsOpen(
        true,
      );

      setIsLoadingArchivedBoards(
        true,
      );

      setArchivedBoardsError(
        null,
      );

      setRestoreBoardError(null);

      setRestoreBoardSuccess(
        null,
      );

      const data =
        await listArchivedBoards(
          id,
        );

      setArchivedBoards(data);
    } catch (error) {
      if (
        axios.isAxiosError(error)
      ) {
        setArchivedBoardsError(
          error.response?.data
            ?.message ??
            "Não foi possível carregar os Boards arquivados.",
        );

        return;
      }

      setArchivedBoardsError(
        "Ocorreu um erro inesperado ao carregar os Boards arquivados.",
      );
    } finally {
      setIsLoadingArchivedBoards(
        false,
      );
    }
  }

  async function handleRetryArchivedBoards() {
    if (!id) {
      return;
    }

    try {
      setIsLoadingArchivedBoards(
        true,
      );

      setArchivedBoardsError(
        null,
      );

      const data =
        await listArchivedBoards(
          id,
        );

      setArchivedBoards(data);
    } catch (error) {
      if (
        axios.isAxiosError(error)
      ) {
        setArchivedBoardsError(
          error.response?.data
            ?.message ??
            "Não foi possível carregar os Boards arquivados.",
        );

        return;
      }

      setArchivedBoardsError(
        "Ocorreu um erro inesperado ao carregar os Boards arquivados.",
      );
    } finally {
      setIsLoadingArchivedBoards(
        false,
      );
    }
  }

  async function handleRestoreBoard(
    boardId: string,
  ) {
    try {
      setRestoringBoardId(
        boardId,
      );

      setRestoreBoardError(
        null,
      );

      setRestoreBoardSuccess(
        null,
      );

      const response =
        await archiveBoard(
          boardId,
          {
            isArchived: false,
          },
        );

      setArchivedBoards(
        (
          currentArchivedBoards,
        ) =>
          currentArchivedBoards.filter(
            (board) =>
              board.id !==
              boardId,
          ),
      );

      setBoards(
        (currentBoards) => [
          response.board,
          ...currentBoards,
        ],
      );

      setRestoreBoardSuccess(
        response.message,
      );
    } catch (error) {
      if (
        axios.isAxiosError(error)
      ) {
        setRestoreBoardError(
          error.response?.data
            ?.message ??
            "Não foi possível restaurar o Board.",
        );

        return;
      }

      setRestoreBoardError(
        "Ocorreu um erro inesperado ao restaurar o Board.",
      );
    } finally {
      setRestoringBoardId(
        null,
      );
    }
  }

  function openDeleteModal() {
    if (
      !canDeleteWorkspace
    ) {
      return;
    }

    setDeleteError(null);

    setDeleteSuccess(null);

    setIsDeleteModalOpen(
      true,
    );
  }

  function closeDeleteModal() {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(
      false,
    );

    setDeleteError(null);

    setDeleteSuccess(null);
  }

  async function handleDeleteWorkspace() {
    if (!id) {
      setDeleteError(
        "ID do Workspace não informado.",
      );

      return;
    }

    try {
      setIsDeleting(true);

      setDeleteError(null);

      setDeleteSuccess(null);

      const response =
        await deleteWorkspace(id);

      setDeleteSuccess(
        response.message,
      );

      window.setTimeout(
        () => {
          navigate(
            "/dashboard",
            {
              replace: true,
            },
          );
        },
        800,
      );
    } catch (error) {
      if (
        axios.isAxiosError(error)
      ) {
        const message =
          error.response?.data
            ?.message ??
          "Não foi possível excluir o Workspace.";

        setDeleteError(message);

        return;
      }

      setDeleteError(
        "Ocorreu um erro inesperado ao excluir o Workspace.",
      );
    } finally {
      setIsDeleting(false);
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

          members:
            data.members ?? [],
        });
      })
      .catch(
        (error: unknown) => {
          if (
            axios.isAxiosError(
              error,
            )
          ) {
            setWorkspaceError(
              error.response
                ?.data
                ?.message ??
                "Não foi possível carregar o Workspace.",
            );

            return;
          }

          setWorkspaceError(
            "Ocorreu um erro inesperado ao carregar o Workspace.",
          );
        },
      )
      .finally(() => {
        setIsLoading(false);
      });
  }

  if (isLoading) {
    return (
      <main className="workspace-page">
        <div
          className="workspace-page-feedback"
          role="status"
        >
          Carregando Workspace...
        </div>
      </main>
    );
  }

  if (
    workspaceError ||
    !workspace
  ) {
    return (
      <main className="workspace-page">
        <div className="workspace-page-error">
          <h1>
            Não foi possível abrir o Workspace
          </h1>

          <p>
            {workspaceError ??
              "O Workspace solicitado não foi encontrado."}
          </p>

          <div className="workspace-page-error-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate(
                  "/dashboard",
                )
              }
            >
              Voltar ao Dashboard
            </button>

            {id && (
              <button
                type="button"
                className="primary-button"
                onClick={
                  handleRetry
                }
              >
                Tentar novamente
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  const formattedCreatedAt =
    new Intl.DateTimeFormat(
      "pt-BR",
      {
        dateStyle: "long",
      },
    ).format(
      new Date(
        workspace.createdAt,
      ),
    );

  return (
    <main className="workspace-page">
      <nav
        className="workspace-breadcrumb"
        aria-label="Navegação estrutural"
      >
        <Link to="/dashboard">
          Dashboard
        </Link>

        <span aria-hidden="true">
          /
        </span>

        <span>
          {workspace.name}
        </span>
      </nav>

      <header className="workspace-page-header">
        <div>
          <span className="workspace-page-label">
            Workspace
          </span>

          <h1>
            {workspace.name}
          </h1>

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
              onClick={
                openEditModal
              }
            >
              Editar Workspace
            </button>
          )}

          {canDeleteWorkspace && (
            <button
              type="button"
              className="danger-button"
              onClick={
                openDeleteModal
              }
            >
              Excluir Workspace
            </button>
          )}

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              navigate(
                "/dashboard",
              )
            }
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

          <strong>
            {
              workspace.members
                .length
            }
          </strong>

          <p>
            {workspace.members
              .length === 1
              ? "pessoa participa deste Workspace"
              : "pessoas participam deste Workspace"}
          </p>
        </article>

        <article className="workspace-summary-card">
          <span>
            Sua permissão
          </span>

          <strong>
            {currentMember
              ? workspaceRoleLabels[
                  currentMember.role
                ]
              : "Não identificada"}
          </strong>

          <p>
            Define as ações disponíveis dentro deste Workspace.
          </p>
        </article>

        <article className="workspace-summary-card">
          <span>Criado em</span>

          <strong>
            {formattedCreatedAt}
          </strong>

          <p>
            Data de criação do espaço de trabalho.
          </p>
        </article>
      </section>

      <WorkspaceMembersSection
        workspaceId={
          workspace.id
        }
        currentUserId={
          user?.id
        }
        onMemberRemoved={(
          memberId,
        ) => {
          setWorkspace(
            (
              currentWorkspace,
            ) => {
              if (
                !currentWorkspace
              ) {
                return currentWorkspace;
              }

              return {
                ...currentWorkspace,

                members:
                  currentWorkspace.members.filter(
                    (
                      member,
                    ) =>
                      member.id !==
                      memberId,
                  ),
              };
            },
          );
        }}
      />

      <section className="workspace-boards-section">
        <div className="workspace-section-header">
          <div>
            <h2>Boards</h2>

            <p>
              Organize as tarefas deste Workspace em quadros.
            </p>
          </div>

          <div className="workspace-board-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                void handleOpenArchivedBoards();
              }}
            >
              {isArchivedBoardsOpen
                ? "Ocultar arquivados"
                : "Boards arquivados"}
            </button>

            {canCreateBoard && (
              <button
                type="button"
                className="primary-button"
                onClick={
                  openCreateBoardModal
                }
              >
                Criar Board
              </button>
            )}
          </div>
        </div>

        {isLoadingBoards && (
          <div
            className="workspace-page-feedback"
            role="status"
          >
            Carregando Boards...
          </div>
        )}

        {!isLoadingBoards &&
          boardsError && (
            <div className="workspace-boards-error">
              <div
                className="api-error"
                role="alert"
              >
                {boardsError}
              </div>

              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  void handleRetryBoards();
                }}
              >
                Tentar novamente
              </button>
            </div>
          )}

        {!isLoadingBoards &&
          !boardsError &&
          boards.length ===
            0 && (
            <div className="workspace-boards-empty">
              <div
                className="workspace-boards-empty-icon"
                aria-hidden="true"
              >
                B
              </div>

              <h3>
                Nenhum Board disponível
              </h3>

              <p>
                Crie o primeiro Board para organizar as tarefas deste Workspace.
              </p>

              {canCreateBoard && (
                <button
                  type="button"
                  className="primary-button"
                  onClick={
                    openCreateBoardModal
                  }
                >
                  Criar primeiro Board
                </button>
              )}
            </div>
          )}

        {!isLoadingBoards &&
          !boardsError &&
          boards.length > 0 && (
            <div className="workspace-boards-grid">
              {boards.map(
                (board) => (
                  <article
                    key={
                      board.id
                    }
                    className="workspace-board-card"
                    style={{
                      backgroundColor:
                        board.backgroundColor ??
                        "#0c66e4",

                      backgroundImage:
                        board.coverImage
                          ? `linear-gradient(
                              rgb(9 30 66 / 42%),
                              rgb(9 30 66 / 72%)
                            ),
                            url("${board.coverImage}")`
                          : undefined,
                    }}
                  >
                    <div className="workspace-board-card-content">
                      <span className="workspace-board-card-role">
                        {board
                          .members?.[0]
                          ?.role ??
                          "MEMBER"}
                      </span>

                      <h3>
                        {
                          board.title
                        }
                      </h3>

                      <p>
                        {board.description ||
                          "Este Board não possui descrição."}
                      </p>
                    </div>

                    <footer className="workspace-board-card-footer">
                      <span>
                        {board
                          .members?.[0]
                          ?.isFavorite
                          ? "★ Favorito"
                          : "Board ativo"}
                      </span>

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                          navigate(
                            `/boards/${board.id}`,
                          )
                        }
                      >
                        Abrir
                      </button>
                    </footer>
                  </article>
                ),
              )}
            </div>
          )}
      </section>

      {isArchivedBoardsOpen && (
        <section className="workspace-archived-boards-section">
          <div className="workspace-section-header">
            <div>
              <h2>
                Boards arquivados
              </h2>

              <p>
                Consulte os Boards arquivados deste Workspace e restaure aqueles que deseja utilizar novamente.
              </p>
            </div>

            <span className="workspace-archived-count">
              {
                archivedBoards.length
              }
            </span>
          </div>

          {restoreBoardError && (
            <div
              className="api-error"
              role="alert"
            >
              {
                restoreBoardError
              }
            </div>
          )}

          {restoreBoardSuccess && (
            <div
              className="success-message"
              role="status"
            >
              {
                restoreBoardSuccess
              }
            </div>
          )}

          {isLoadingArchivedBoards && (
            <div
              className="workspace-page-feedback"
              role="status"
            >
              Carregando Boards arquivados...
            </div>
          )}

          {!isLoadingArchivedBoards &&
            archivedBoardsError && (
              <div className="workspace-boards-error">
                <div
                  className="api-error"
                  role="alert"
                >
                  {
                    archivedBoardsError
                  }
                </div>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    void handleRetryArchivedBoards();
                  }}
                >
                  Tentar novamente
                </button>
              </div>
            )}

          {!isLoadingArchivedBoards &&
            !archivedBoardsError &&
            archivedBoards.length ===
              0 && (
              <div className="workspace-boards-empty">
                <div
                  className="workspace-boards-empty-icon"
                  aria-hidden="true"
                >
                  A
                </div>

                <h3>
                  Nenhum Board arquivado
                </h3>

                <p>
                  Os Boards arquivados deste Workspace aparecerão aqui.
                </p>
              </div>
            )}

          {!isLoadingArchivedBoards &&
            !archivedBoardsError &&
            archivedBoards.length >
              0 && (
              <div className="workspace-archived-boards-list">
                {archivedBoards.map(
                  (
                    archivedBoard,
                  ) => {
                    const canRestoreBoard =
                      archivedBoard
                        .members?.[0]
                        ?.role ===
                        "OWNER" ||
                      archivedBoard
                        .members?.[0]
                        ?.role ===
                        "ADMIN";

                    return (
                      <article
                        key={
                          archivedBoard.id
                        }
                        className="workspace-archived-board-card"
                      >
                        <div className="workspace-archived-board-info">
                          <span className="workspace-archived-board-label">
                            Arquivado
                          </span>

                          <h3>
                            {
                              archivedBoard.title
                            }
                          </h3>

                          <p>
                            {archivedBoard.description ||
                              "Este Board não possui descrição."}
                          </p>
                        </div>

                        <div className="workspace-archived-board-actions">
                          {canRestoreBoard ? (
                            <button
                              type="button"
                              className="primary-button"
                              onClick={() => {
                                void handleRestoreBoard(
                                  archivedBoard.id,
                                );
                              }}
                              disabled={
                                restoringBoardId ===
                                archivedBoard.id
                              }
                            >
                              {restoringBoardId ===
                              archivedBoard.id
                                ? "Restaurando..."
                                : "Restaurar"}
                            </button>
                          ) : (
                            <span className="workspace-archived-board-readonly">
                              Somente leitura
                            </span>
                          )}
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            )}
        </section>
      )}

      {isCreateBoardModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={
            closeCreateBoardModal
          }
        >
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-board-title"
            onMouseDown={(
              event,
            ) =>
              event.stopPropagation()
            }
          >
            <header className="modal-header">
              <div>
                <h2 id="create-board-title">
                  Criar Board
                </h2>

                <p>
                  Crie um quadro para organizar as tarefas deste Workspace.
                </p>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={
                  closeCreateBoardModal
                }
                disabled={
                  isCreatingBoard
                }
                aria-label="Fechar modal"
              >
                ×
              </button>
            </header>

            <form
              className="workspace-form"
              onSubmit={handleBoardSubmit(
                handleCreateBoard,
              )}
            >
              <div className="form-field">
                <label htmlFor="board-title">
                  Título
                </label>

                <input
                  id="board-title"
                  type="text"
                  placeholder="Ex.: Desenvolvimento"
                  autoFocus
                  {...registerBoard(
                    "title",
                  )}
                />

                {boardFormErrors.title && (
                  <span className="field-error">
                    {
                      boardFormErrors
                        .title
                        .message
                    }
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="board-description">
                  Descrição
                </label>

                <textarea
                  id="board-description"
                  rows={4}
                  placeholder="Descreva o objetivo deste Board"
                  {...registerBoard(
                    "description",
                  )}
                />

                {boardFormErrors.description && (
                  <span className="field-error">
                    {
                      boardFormErrors
                        .description
                        .message
                    }
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="board-background-color">
                  Cor de fundo
                </label>

                <input
                  id="board-background-color"
                  type="color"
                  {...registerBoard(
                    "backgroundColor",
                  )}
                />

                {boardFormErrors.backgroundColor && (
                  <span className="field-error">
                    {
                      boardFormErrors
                        .backgroundColor
                        .message
                    }
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="board-cover-image">
                  Imagem de capa
                </label>

                <input
                  id="board-cover-image"
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  {...registerBoard(
                    "coverImage",
                  )}
                />

                {boardFormErrors.coverImage && (
                  <span className="field-error">
                    {
                      boardFormErrors
                        .coverImage
                        .message
                    }
                  </span>
                )}
              </div>

              {createBoardError && (
                <div
                  className="api-error"
                  role="alert"
                >
                  {
                    createBoardError
                  }
                </div>
              )}

              {createBoardSuccess && (
                <div
                  className="success-message"
                  role="status"
                >
                  {
                    createBoardSuccess
                  }
                </div>
              )}

              <footer className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    closeCreateBoardModal
                  }
                  disabled={
                    isCreatingBoard
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={
                    isCreatingBoard
                  }
                >
                  {isCreatingBoard
                    ? "Criando..."
                    : "Criar Board"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {isEditModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={
            closeEditModal
          }
        >
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-workspace-title"
            onMouseDown={(
              event,
            ) =>
              event.stopPropagation()
            }
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
                onClick={
                  closeEditModal
                }
                disabled={
                  isUpdatingWorkspace
                }
                aria-label="Fechar modal"
              >
                ×
              </button>
            </header>

            <form
              className="workspace-form"
              onSubmit={handleWorkspaceUpdateSubmit(
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
                  {...registerWorkspaceUpdate(
                    "name",
                  )}
                />

                {workspaceUpdateErrors.name && (
                  <span className="field-error">
                    {
                      workspaceUpdateErrors
                        .name
                        .message
                    }
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
                  {...registerWorkspaceUpdate(
                    "description",
                  )}
                />

                {workspaceUpdateErrors.description && (
                  <span className="field-error">
                    {
                      workspaceUpdateErrors
                        .description
                        .message
                    }
                  </span>
                )}
              </div>

              {updateError && (
                <div
                  className="api-error"
                  role="alert"
                >
                  {updateError}
                </div>
              )}

              {updateSuccess && (
                <div
                  className="success-message"
                  role="status"
                >
                  {
                    updateSuccess
                  }
                </div>
              )}

              <footer className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    closeEditModal
                  }
                  disabled={
                    isUpdatingWorkspace
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={
                    isUpdatingWorkspace
                  }
                >
                  {isUpdatingWorkspace
                    ? "Salvando..."
                    : "Salvar alterações"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {isDeleteModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={
            closeDeleteModal
          }
        >
          <section
            className="modal-card"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-workspace-title"
            aria-describedby="delete-workspace-description"
            onMouseDown={(
              event,
            ) =>
              event.stopPropagation()
            }
          >
            <header className="modal-header">
              <div>
                <h2 id="delete-workspace-title">
                  Excluir Workspace
                </h2>

                <p id="delete-workspace-description">
                  Esta ação não poderá ser desfeita.
                </p>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={
                  closeDeleteModal
                }
                disabled={
                  isDeleting
                }
                aria-label="Fechar modal"
              >
                ×
              </button>
            </header>

            <div className="delete-workspace-content">
              <div className="delete-workspace-warning">
                <strong>
                  Você está prestes a excluir:
                </strong>

                <span>
                  {workspace.name}
                </span>

                <p>
                  Todos os dados vinculados a este Workspace serão removidos permanentemente.
                </p>
              </div>

              {deleteError && (
                <div
                  className="api-error"
                  role="alert"
                >
                  {
                    deleteError
                  }
                </div>
              )}

              {deleteSuccess && (
                <div
                  className="success-message"
                  role="status"
                >
                  {
                    deleteSuccess
                  }
                </div>
              )}

              <footer className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    closeDeleteModal
                  }
                  disabled={
                    isDeleting
                  }
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="danger-button"
                  onClick={() => {
                    void handleDeleteWorkspace();
                  }}
                  disabled={
                    isDeleting
                  }
                >
                  {isDeleting
                    ? "Excluindo..."
                    : "Excluir definitivamente"}
                </button>
              </footer>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}