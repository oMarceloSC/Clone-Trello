import axios from "axios";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router";

import { useAuth } from "../../auth/hooks/useAuth";
import {
  archiveBoard,
  deleteBoard,
  favoriteBoard,
  getBoardById,
} from "../services/board.service";
import type {
  Board,
  BoardMember,
  BoardRole,
} from "../types/board.types";

const boardRoleLabels: Record<BoardRole, string> = {
  OWNER: "Proprietário",
  ADMIN: "Administrador",
  MEMBER: "Membro",
  VIEWER: "Visualizador",
};

export function BoardPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [board, setBoard] =
    useState<Board | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [boardError, setBoardError] =
    useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState<string | null>(null);

  const [deleteSuccess, setDeleteSuccess] =
    useState<string | null>(null);

  const [isUpdatingFavorite, setIsUpdatingFavorite] =
    useState(false);

  const [favoriteError, setFavoriteError] =
    useState<string | null>(null);

  const [isArchiveModalOpen, setIsArchiveModalOpen] =
    useState(false);

  const [isArchiving, setIsArchiving] =
    useState(false);

  const [archiveError, setArchiveError] =
    useState<string | null>(null);

  const [archiveSuccess, setArchiveSuccess] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadBoard() {
      if (!id) {
        setBoardError(
          "ID do Board não informado.",
        );

        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setBoardError(null);

        const data = await getBoardById(id);

        setBoard({
          ...data,
          members: data.members ?? [],
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.message ??
            "Não foi possível carregar o Board.";

          setBoardError(message);
          return;
        }

        setBoardError(
          "Ocorreu um erro inesperado ao carregar o Board.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadBoard();
  }, [id]);

  const currentMember:
    | BoardMember
    | undefined = useMemo(
    () =>
      board?.members.find(
        (member) =>
          member.user?.id === user?.id ||
          member.userId === user?.id,
      ),
    [board?.members, user?.id],
  );

  const canDeleteBoard =
    currentMember?.role === "OWNER";

  const canArchiveBoard =
    currentMember?.role === "OWNER" ||
    currentMember?.role === "ADMIN";

  const isFavorite =
    currentMember?.isFavorite ?? false;

  function handleRetry() {
    if (!id) {
      return;
    }

    setIsLoading(true);
    setBoardError(null);

    void getBoardById(id)
      .then((data) => {
        setBoard({
          ...data,
          members: data.members ?? [],
        });
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error)) {
          setBoardError(
            error.response?.data?.message ??
              "Não foi possível carregar o Board.",
          );

          return;
        }

        setBoardError(
          "Ocorreu um erro inesperado ao carregar o Board.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  async function handleFavoriteBoard() {
    if (
      !id ||
      !currentMember ||
      isUpdatingFavorite
    ) {
      return;
    }

    const nextFavoriteState =
      !currentMember.isFavorite;

    try {
      setIsUpdatingFavorite(true);
      setFavoriteError(null);

      const response =
        await favoriteBoard(id, {
          isFavorite: nextFavoriteState,
        });

      setBoard((currentBoard) => {
        if (!currentBoard) {
          return currentBoard;
        }

        return {
          ...currentBoard,
          members: currentBoard.members.map(
            (member) =>
              member.id === response.member.id
                ? {
                    ...member,
                    isFavorite:
                      response.member.isFavorite,
                    updatedAt:
                      response.member.updatedAt,
                  }
                : member,
          ),
        };
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Não foi possível atualizar o favorito.";

        setFavoriteError(message);
        return;
      }

      setFavoriteError(
        "Ocorreu um erro inesperado ao atualizar o favorito.",
      );
    } finally {
      setIsUpdatingFavorite(false);
    }
  }

  function openArchiveModal() {
    if (!canArchiveBoard) {
      return;
    }

    setArchiveError(null);
    setArchiveSuccess(null);
    setIsArchiveModalOpen(true);
  }

  function closeArchiveModal() {
    if (isArchiving) {
      return;
    }

    setIsArchiveModalOpen(false);
    setArchiveError(null);
    setArchiveSuccess(null);
  }

  async function handleArchiveBoard() {
    if (!id) {
      setArchiveError(
        "ID do Board não informado.",
      );

      return;
    }

    try {
      setIsArchiving(true);
      setArchiveError(null);
      setArchiveSuccess(null);

      const response =
        await archiveBoard(id, {
          isArchived: true,
        });

      setArchiveSuccess(response.message);

      window.setTimeout(() => {
        if (board?.workspace?.id) {
          navigate(
            `/workspaces/${board.workspace.id}`,
            {
              replace: true,
            },
          );

          return;
        }

        navigate("/dashboard", {
          replace: true,
        });
      }, 800);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Não foi possível arquivar o Board.";

        setArchiveError(message);
        return;
      }

      setArchiveError(
        "Ocorreu um erro inesperado ao arquivar o Board.",
      );
    } finally {
      setIsArchiving(false);
    }
  }

  function openDeleteModal() {
    if (!canDeleteBoard) {
      return;
    }

    setDeleteError(null);
    setDeleteSuccess(null);
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setDeleteError(null);
    setDeleteSuccess(null);
  }

  async function handleDeleteBoard() {
    if (!id) {
      setDeleteError(
        "ID do Board não informado.",
      );

      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);
      setDeleteSuccess(null);

      const response =
        await deleteBoard(id);

      setDeleteSuccess(response.message);

      window.setTimeout(() => {
        if (board?.workspace?.id) {
          navigate(
            `/workspaces/${board.workspace.id}`,
            {
              replace: true,
            },
          );

          return;
        }

        navigate("/dashboard", {
          replace: true,
        });
      }, 800);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Não foi possível excluir o Board.";

        setDeleteError(message);
        return;
      }

      setDeleteError(
        "Ocorreu um erro inesperado ao excluir o Board.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="board-page">
        <div
          className="board-page-feedback"
          role="status"
        >
          Carregando Board...
        </div>
      </main>
    );
  }

  if (boardError || !board) {
    return (
      <main className="board-page">
        <div className="board-page-error">
          <h1>
            Não foi possível abrir o Board
          </h1>

          <p>
            {boardError ??
              "O Board solicitado não foi encontrado."}
          </p>

          <div className="board-page-error-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate(-1)}
            >
              Voltar
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

  const formattedCreatedAt =
    new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "long",
    }).format(
      new Date(board.createdAt),
    );

  return (
    <main className="board-page">
      <nav
        className="board-breadcrumb"
        aria-label="Navegação estrutural"
      >
        <Link to="/dashboard">
          Dashboard
        </Link>

        <span aria-hidden="true">
          /
        </span>

        {board.workspace && (
          <>
            <Link
              to={`/workspaces/${board.workspace.id}`}
            >
              {board.workspace.name}
            </Link>

            <span aria-hidden="true">
              /
            </span>
          </>
        )}

        <span>{board.title}</span>
      </nav>

      <header
        className="board-page-header"
        style={{
          backgroundColor:
            board.backgroundColor ??
            "#0c66e4",
          backgroundImage:
            board.coverImage
              ? `linear-gradient(
                  rgb(9 30 66 / 44%),
                  rgb(9 30 66 / 72%)
                ),
                url("${board.coverImage}")`
              : undefined,
        }}
      >
        <div className="board-page-header-content">
          <span className="board-page-label">
            Board
          </span>

          <h1>{board.title}</h1>

          <p>
            {board.description ||
              "Este Board não possui descrição."}
          </p>

          {favoriteError && (
            <div
              className="board-favorite-error"
              role="alert"
            >
              {favoriteError}
            </div>
          )}
        </div>

        <div className="board-page-header-actions">
          {currentMember && (
            <button
              type="button"
              className={`board-favorite-button ${
                isFavorite
                  ? "board-favorite-button-active"
                  : ""
              }`}
              onClick={() => {
                void handleFavoriteBoard();
              }}
              disabled={isUpdatingFavorite}
              aria-pressed={isFavorite}
              title={
                isFavorite
                  ? "Remover dos favoritos"
                  : "Favoritar Board"
              }
            >
              <span aria-hidden="true">
                {isFavorite ? "★" : "☆"}
              </span>

              {isUpdatingFavorite
                ? "Salvando..."
                : isFavorite
                  ? "Favoritado"
                  : "Favoritar"}
            </button>
          )}

          {canArchiveBoard && (
            <button
              type="button"
              className="secondary-button"
              onClick={openArchiveModal}
            >
              Arquivar Board
            </button>
          )}

          {canDeleteBoard && (
            <button
              type="button"
              className="danger-button"
              onClick={openDeleteModal}
            >
              Excluir Board
            </button>
          )}

          {board.workspace && (
            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate(
                  `/workspaces/${board.workspace?.id}`,
                )
              }
            >
              Voltar ao Workspace
            </button>
          )}
        </div>
      </header>

      <section
        className="board-summary-grid"
        aria-label="Resumo do Board"
      >
        <article className="board-summary-card">
          <span>Workspace</span>

          <strong>
            {board.workspace?.name ??
              "Não identificado"}
          </strong>

          <p>
            Workspace ao qual este Board pertence.
          </p>
        </article>

        <article className="board-summary-card">
          <span>Sua permissão</span>

          <strong>
            {currentMember
              ? boardRoleLabels[
                  currentMember.role
                ]
              : "Não identificada"}
          </strong>

          <p>
            Define as ações disponíveis dentro deste Board.
          </p>
        </article>

        <article className="board-summary-card">
          <span>Membros</span>

          <strong>
            {board.members.length}
          </strong>

          <p>
            {board.members.length === 1
              ? "pessoa participa deste Board"
              : "pessoas participam deste Board"}
          </p>
        </article>

        <article className="board-summary-card">
          <span>Criado em</span>

          <strong>
            {formattedCreatedAt}
          </strong>

          <p>
            Data de criação deste Board.
          </p>
        </article>
      </section>

      <section className="board-members-section">
        <div className="board-section-header">
          <div>
            <h2>Membros</h2>

            <p>
              Participantes com acesso a este Board.
            </p>
          </div>

          <span className="board-members-count">
            {board.members.length}
          </span>
        </div>

        {board.members.length === 0 ? (
          <div className="board-members-empty">
            <h3>
              Nenhum membro encontrado
            </h3>

            <p>
              Este Board ainda não possui membros.
            </p>
          </div>
        ) : (
          <div className="board-members-list">
            {board.members.map(
              (member) => {
                const memberName =
                  member.user?.name ??
                  "Usuário";

                const avatarLetter =
                  memberName
                    .trim()
                    .charAt(0)
                    .toUpperCase() ||
                  "?";

                const isCurrentUser =
                  member.user?.id ===
                    user?.id ||
                  member.userId ===
                    user?.id;

                return (
                  <article
                    key={member.id}
                    className="board-member-card"
                  >
                    <div
                      className="board-member-avatar"
                      aria-hidden="true"
                    >
                      {avatarLetter}
                    </div>

                    <div className="board-member-info">
                      <div className="board-member-name">
                        <strong>
                          {memberName}
                        </strong>

                        {isCurrentUser && (
                          <span className="current-user-badge">
                            Você
                          </span>
                        )}
                      </div>

                      <span>
                        {member.user?.email ??
                          "Email não disponível"}
                      </span>
                    </div>

                    <span
                      className={`board-role-badge board-role-${member.role.toLowerCase()}`}
                    >
                      {
                        boardRoleLabels[
                          member.role
                        ]
                      }
                    </span>
                  </article>
                );
              },
            )}
          </div>
        )}
      </section>

      <section className="board-lists-section">
        <div className="board-section-header">
          <div>
            <h2>Lists</h2>

            <p>
              As listas deste Board serão exibidas aqui.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            disabled
            title="Disponível na Milestone de Lists"
          >
            Criar List
          </button>
        </div>

        <div className="board-lists-empty">
          <div
            className="board-lists-empty-icon"
            aria-hidden="true"
          >
            L
          </div>

          <h3>
            Nenhuma List disponível
          </h3>

          <p>
            A criação e listagem de Lists serão implementadas na próxima milestone.
          </p>
        </div>
      </section>

      {isArchiveModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={closeArchiveModal}
        >
          <section
            className="modal-card"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="archive-board-title"
            aria-describedby="archive-board-description"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <header className="modal-header">
              <div>
                <h2 id="archive-board-title">
                  Arquivar Board
                </h2>

                <p id="archive-board-description">
                  O Board deixará de aparecer na lista de Boards ativos.
                </p>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeArchiveModal}
                disabled={isArchiving}
                aria-label="Fechar modal"
              >
                ×
              </button>
            </header>

            <div className="delete-board-content">
              <div className="archive-board-warning">
                <strong>
                  Você está prestes a arquivar:
                </strong>

                <span>
                  {board.title}
                </span>

                <p>
                  O Board não será excluído. Você poderá restaurá-lo posteriormente pela área de Boards arquivados do Workspace.
                </p>
              </div>

              {archiveError && (
                <div
                  className="api-error"
                  role="alert"
                >
                  {archiveError}
                </div>
              )}

              {archiveSuccess && (
                <div
                  className="success-message"
                  role="status"
                >
                  {archiveSuccess}
                </div>
              )}

              <footer className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeArchiveModal}
                  disabled={isArchiving}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    void handleArchiveBoard();
                  }}
                  disabled={isArchiving}
                >
                  {isArchiving
                    ? "Arquivando..."
                    : "Arquivar Board"}
                </button>
              </footer>
            </div>
          </section>
        </div>
      )}

      {isDeleteModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={closeDeleteModal}
        >
          <section
            className="modal-card"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-board-title"
            aria-describedby="delete-board-description"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <header className="modal-header">
              <div>
                <h2 id="delete-board-title">
                  Excluir Board
                </h2>

                <p id="delete-board-description">
                  Esta ação não poderá ser desfeita.
                </p>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                aria-label="Fechar modal"
              >
                ×
              </button>
            </header>

            <div className="delete-board-content">
              <div className="delete-board-warning">
                <strong>
                  Você está prestes a excluir:
                </strong>

                <span>
                  {board.title}
                </span>

                <p>
                  Todos os dados vinculados a este Board serão removidos permanentemente.
                </p>
              </div>

              {deleteError && (
                <div
                  className="api-error"
                  role="alert"
                >
                  {deleteError}
                </div>
              )}

              {deleteSuccess && (
                <div
                  className="success-message"
                  role="status"
                >
                  {deleteSuccess}
                </div>
              )}

              <footer className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="danger-button"
                  onClick={() => {
                    void handleDeleteBoard();
                  }}
                  disabled={isDeleting}
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