import axios from "axios";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { listWorkspaceMembers } from "../../workspaces/services/workspace.service";
import type { WorkspaceMember } from "../../workspaces/types/workspace.types";
import {
  addBoardMember,
  listBoardMembers,
  removeBoardMember,
  updateBoardMemberRole,
} from "../services/board.service";
import type {
  AssignableBoardRole,
  BoardMember,
  BoardRole,
} from "../types/board.types";

type BoardMembersSectionProps = {
  boardId: string;
  workspaceId: string;
  currentUserId?: string;
  initialMembers: BoardMember[];
  onMembersChange: (members: BoardMember[]) => void;
};

const roleLabels: Record<BoardRole, string> = {
  OWNER: "Proprietário",
  ADMIN: "Administrador",
  MEMBER: "Membro",
  VIEWER: "Visualizador",
};

const assignableRoles: AssignableBoardRole[] = [
  "ADMIN",
  "MEMBER",
  "VIEWER",
];

function getRequestError(
  error: unknown,
  fallback: string,
) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
}

export function BoardMembersSection({
  boardId,
  workspaceId,
  currentUserId,
  initialMembers,
  onMembersChange,
}: BoardMembersSectionProps) {
  const [members, setMembers] =
    useState<BoardMember[]>(initialMembers);
  const [isLoading, setIsLoading] =
    useState(true);
  const [membersError, setMembersError] =
    useState<string | null>(null);
  const [feedback, setFeedback] =
    useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false);
  const [workspaceMembers, setWorkspaceMembers] =
    useState<WorkspaceMember[]>([]);
  const [isLoadingCandidates, setIsLoadingCandidates] =
    useState(false);
  const [candidatesError, setCandidatesError] =
    useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] =
    useState("");
  const [selectedRole, setSelectedRole] =
    useState<AssignableBoardRole>("MEMBER");
  const [isAdding, setIsAdding] =
    useState(false);
  const [addError, setAddError] =
    useState<string | null>(null);

  const [updatingMemberId, setUpdatingMemberId] =
    useState<string | null>(null);
  const [roleError, setRoleError] =
    useState<string | null>(null);

  const [memberToRemove, setMemberToRemove] =
    useState<BoardMember | null>(null);
  const [isRemoving, setIsRemoving] =
    useState(false);
  const [removeError, setRemoveError] =
    useState<string | null>(null);

  const currentMember = useMemo(
    () =>
      members.find(
        (member) =>
          member.userId === currentUserId ||
          member.user?.id === currentUserId,
      ),
    [currentUserId, members],
  );

  const canAdd =
    currentMember?.role === "OWNER" ||
    currentMember?.role === "ADMIN";
  const canManage =
    currentMember?.role === "OWNER";

  const candidates = useMemo(() => {
    const boardUserIds = new Set(
      members.map((member) => member.userId),
    );

    return workspaceMembers.filter((member) => {
      const candidateId =
        member.user?.id ?? member.userId;

      return Boolean(
        candidateId &&
          !boardUserIds.has(candidateId),
      );
    });
  }, [members, workspaceMembers]);

  useEffect(() => {
    let isActive = true;

    async function loadMembers() {
      try {
        setIsLoading(true);
        setMembersError(null);
        const data = await listBoardMembers(boardId);

        if (isActive) {
          setMembers(data);
          onMembersChange(data);
        }
      } catch (error) {
        if (isActive) {
          setMembersError(
            getRequestError(
              error,
              "Não foi possível carregar os membros do Board.",
            ),
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadMembers();

    return () => {
      isActive = false;
    };
  }, [boardId, onMembersChange]);

  function updateMembers(nextMembers: BoardMember[]) {
    setMembers(nextMembers);
    onMembersChange(nextMembers);
  }

  async function openAddModal() {
    if (!canAdd) {
      return;
    }

    setIsAddModalOpen(true);
    setCandidatesError(null);
    setAddError(null);
    setSelectedUserId("");
    setSelectedRole("MEMBER");

    try {
      setIsLoadingCandidates(true);
      const data =
        await listWorkspaceMembers(workspaceId);
      setWorkspaceMembers(data);
    } catch (error) {
      setCandidatesError(
        getRequestError(
          error,
          "Não foi possível carregar os membros do Workspace.",
        ),
      );
    } finally {
      setIsLoadingCandidates(false);
    }
  }

  function closeAddModal() {
    if (isAdding) {
      return;
    }

    setIsAddModalOpen(false);
    setAddError(null);
  }

  async function handleAddMember() {
    if (!selectedUserId) {
      setAddError("Selecione um membro do Workspace.");
      return;
    }

    try {
      setIsAdding(true);
      setAddError(null);
      setFeedback(null);

      const response = await addBoardMember(
        boardId,
        {
          memberUserId: selectedUserId,
          role: selectedRole,
        },
      );

      updateMembers([...members, response.member]);
      setFeedback(response.message);
      setIsAddModalOpen(false);
    } catch (error) {
      setAddError(
        getRequestError(
          error,
          "Não foi possível adicionar o membro.",
        ),
      );
    } finally {
      setIsAdding(false);
    }
  }

  async function handleRoleChange(
    member: BoardMember,
    role: AssignableBoardRole,
  ) {
    try {
      setUpdatingMemberId(member.id);
      setRoleError(null);
      setFeedback(null);

      const response =
        await updateBoardMemberRole(
          boardId,
          member.id,
          { role },
        );

      updateMembers(
        members.map((current) =>
          current.id === response.member.id
            ? response.member
            : current,
        ),
      );
      setFeedback(response.message);
    } catch (error) {
      setRoleError(
        getRequestError(
          error,
          "Não foi possível alterar a permissão.",
        ),
      );
    } finally {
      setUpdatingMemberId(null);
    }
  }

  function openRemoveModal(member: BoardMember) {
    if (!canManage || member.role === "OWNER") {
      return;
    }

    setRemoveError(null);
    setMemberToRemove(member);
  }

  function closeRemoveModal() {
    if (isRemoving) {
      return;
    }

    setMemberToRemove(null);
    setRemoveError(null);
  }

  async function handleRemoveMember() {
    if (!memberToRemove) {
      return;
    }

    try {
      setIsRemoving(true);
      setRemoveError(null);
      setFeedback(null);

      const response = await removeBoardMember(
        boardId,
        memberToRemove.id,
      );
      updateMembers(
        members.filter(
          (member) =>
            member.id !== memberToRemove.id,
        ),
      );
      setFeedback(response.message);
      setMemberToRemove(null);
    } catch (error) {
      setRemoveError(
        getRequestError(
          error,
          "Não foi possível remover o membro.",
        ),
      );
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <section
      id="board-members-management"
      className="board-members-section"
    >
      <div className="board-section-header board-members-management-header">
        <div>
          <h2>Membros do Board</h2>
          <p>Gerencie quem participa e as permissões do Board.</p>
        </div>

        <div className="board-members-header-actions">
          <span className="board-members-count">
            {members.length}
          </span>

          {canAdd && (
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                void openAddModal();
              }}
            >
              Adicionar membro
            </button>
          )}
        </div>
      </div>

      {feedback && (
        <div className="success-message" role="status">
          {feedback}
        </div>
      )}

      {(membersError || roleError) && (
        <div className="api-error" role="alert">
          {roleError ?? membersError}
        </div>
      )}

      {isLoading ? (
        <div className="board-members-feedback" role="status">
          Carregando membros...
        </div>
      ) : members.length === 0 ? (
        <div className="board-members-empty">
          <h3>Nenhum membro encontrado</h3>
          <p>Este Board ainda não possui membros.</p>
        </div>
      ) : (
        <div className="board-members-list">
          {members.map((member) => {
            const name = member.user?.name ?? "Usuário";
            const isCurrentUser =
              member.userId === currentUserId ||
              member.user?.id === currentUserId;
            const canEditTarget =
              canManage &&
              member.role !== "OWNER" &&
              !isCurrentUser;

            return (
              <article key={member.id} className="board-member-card">
                <div className="board-member-avatar" aria-hidden="true">
                  {member.user?.avatarUrl ? (
                    <img src={member.user.avatarUrl} alt="" />
                  ) : (
                    name.trim().charAt(0).toUpperCase() || "?"
                  )}
                </div>

                <div className="board-member-info">
                  <div className="board-member-name">
                    <strong>{name}</strong>
                    {isCurrentUser && (
                      <span className="current-user-badge">Você</span>
                    )}
                  </div>
                  <span>{member.user?.email ?? "Email não disponível"}</span>
                </div>

                <div className="board-member-management-actions">
                  {canEditTarget ? (
                    <select
                      value={member.role}
                      disabled={updatingMemberId === member.id}
                      aria-label={`Permissão de ${name}`}
                      onChange={(event) => {
                        void handleRoleChange(
                          member,
                          event.target.value as AssignableBoardRole,
                        );
                      }}
                    >
                      {assignableRoles.map((role) => (
                        <option key={role} value={role}>
                          {roleLabels[role]}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={`board-role-badge board-role-${member.role.toLowerCase()}`}>
                      {roleLabels[member.role]}
                    </span>
                  )}

                  {canEditTarget && (
                    <button
                      type="button"
                      className="danger-button board-member-remove-button"
                      onClick={() => openRemoveModal(member)}
                    >
                      Remover
                    </button>
                  )}

                  {updatingMemberId === member.id && (
                    <span className="board-member-processing">Salvando...</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {isAddModalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={closeAddModal}>
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-board-member-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="modal-header">
              <div>
                <h2 id="add-board-member-title">Adicionar membro</h2>
                <p>Escolha uma pessoa que já participa do Workspace.</p>
              </div>
              <button
                type="button"
                className="modal-close-button"
                onClick={closeAddModal}
                disabled={isAdding}
                aria-label="Fechar modal"
              >
                ×
              </button>
            </header>

            <div className="board-member-modal-content">
              {isLoadingCandidates ? (
                <div className="board-members-feedback" role="status">
                  Carregando candidatos...
                </div>
              ) : candidatesError ? (
                <div className="api-error" role="alert">{candidatesError}</div>
              ) : candidates.length === 0 ? (
                <div className="board-members-empty">
                  <h3>Nenhum candidato disponível</h3>
                  <p>Todos os membros do Workspace já pertencem a este Board.</p>
                </div>
              ) : (
                <>
                  <fieldset className="board-member-candidates">
                    <legend>Membro do Workspace</legend>
                    {candidates.map((candidate) => {
                      const candidateId = candidate.user?.id ?? candidate.userId ?? "";
                      const candidateName = candidate.user?.name ?? "Usuário";

                      return (
                        <label
                          key={candidate.id}
                          className={`board-member-candidate ${selectedUserId === candidateId ? "board-member-candidate-selected" : ""}`}
                        >
                          <input
                            type="radio"
                            name="board-member-candidate"
                            value={candidateId}
                            checked={selectedUserId === candidateId}
                            disabled={isAdding}
                            onChange={() => setSelectedUserId(candidateId)}
                          />
                          <span className="board-member-avatar" aria-hidden="true">
                            {candidate.user?.avatarUrl ? (
                              <img src={candidate.user.avatarUrl} alt="" />
                            ) : (
                              candidateName.trim().charAt(0).toUpperCase() || "?"
                            )}
                          </span>
                          <span className="board-member-candidate-info">
                            <strong>{candidateName}</strong>
                            <small>{candidate.user?.email ?? "Email não disponível"}</small>
                          </span>
                        </label>
                      );
                    })}
                  </fieldset>

                  <label className="board-member-field">
                    <span>Permissão</span>
                    <select
                      value={selectedRole}
                      disabled={isAdding}
                      onChange={(event) => setSelectedRole(event.target.value as AssignableBoardRole)}
                    >
                      {assignableRoles.map((role) => (
                        <option key={role} value={role}>{roleLabels[role]}</option>
                      ))}
                    </select>
                  </label>
                </>
              )}

              {addError && <div className="api-error" role="alert">{addError}</div>}

              <footer className="modal-actions">
                <button type="button" className="secondary-button" onClick={closeAddModal} disabled={isAdding}>
                  Cancelar
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => void handleAddMember()}
                  disabled={isAdding || isLoadingCandidates || candidates.length === 0}
                >
                  {isAdding ? "Adicionando..." : "Adicionar membro"}
                </button>
              </footer>
            </div>
          </section>
        </div>
      )}

      {memberToRemove && (
        <div className="modal-backdrop" role="presentation" onMouseDown={closeRemoveModal}>
          <section
            className="modal-card"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="remove-board-member-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="modal-header">
              <div>
                <h2 id="remove-board-member-title">Remover membro</h2>
                <p>O usuário perderá o acesso a este Board.</p>
              </div>
              <button type="button" className="modal-close-button" onClick={closeRemoveModal} disabled={isRemoving} aria-label="Fechar modal">
                ×
              </button>
            </header>

            <div className="board-member-modal-content">
              <div className="delete-board-warning">
                <strong>Remover do Board:</strong>
                <span>{memberToRemove.user?.name ?? "Usuário"}</span>
                <p>A conta e a participação no Workspace não serão removidas.</p>
              </div>

              {removeError && <div className="api-error" role="alert">{removeError}</div>}

              <footer className="modal-actions">
                <button type="button" className="secondary-button" onClick={closeRemoveModal} disabled={isRemoving}>
                  Cancelar
                </button>
                <button type="button" className="danger-button" onClick={() => void handleRemoveMember()} disabled={isRemoving}>
                  {isRemoving ? "Removendo..." : "Remover membro"}
                </button>
              </footer>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
