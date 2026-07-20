import axios from "axios";
import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

import {
  listWorkspaceMembers,
  updateWorkspaceMemberRole,
} from "../services/workspace.service";

import type {
  WorkspaceMember,
  WorkspaceRole,
} from "../types/workspace.types";

type WorkspaceMembersSectionProps = {
  workspaceId: string;
  currentUserId?: string;
};

type EditableWorkspaceRole = Exclude<
  WorkspaceRole,
  "OWNER"
>;

const workspaceRoleLabels: Record<WorkspaceRole, string> = {
  OWNER: "Proprietário",
  ADMIN: "Administrador",
  MEMBER: "Membro",
  VIEWER: "Visualizador",
};

const workspaceRoleClassNames: Record<
  WorkspaceRole,
  string
> = {
  OWNER: "workspace-role-owner",
  ADMIN: "workspace-role-admin",
  MEMBER: "workspace-role-member",
  VIEWER: "workspace-role-viewer",
};

const editableWorkspaceRoles: EditableWorkspaceRole[] = [
  "ADMIN",
  "MEMBER",
  "VIEWER",
];

export function WorkspaceMembersSection({
  workspaceId,
  currentUserId,
}: WorkspaceMembersSectionProps) {
  const [members, setMembers] = useState<WorkspaceMember[]>(
    [],
  );

  const [isLoading, setIsLoading] = useState(true);

  const [membersError, setMembersError] =
    useState<string | null>(null);

  const [updatingMemberId, setUpdatingMemberId] =
    useState<string | null>(null);

  const [memberUpdateErrors, setMemberUpdateErrors] =
    useState<Record<string, string>>({});

  const [memberUpdateSuccess, setMemberUpdateSuccess] =
    useState<Record<string, string>>({});

  async function loadMembers() {
    try {
      setIsLoading(true);
      setMembersError(null);

      const data = await listWorkspaceMembers(workspaceId);

      setMembers(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Não foi possível carregar os membros.";

        setMembersError(message);
        return;
      }

      setMembersError(
        "Ocorreu um erro inesperado ao carregar os membros.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadMembers();
  }, [workspaceId]);

  const currentMember = members.find(
    (member) =>
      member.user?.id === currentUserId ||
      member.userId === currentUserId,
  );

  const canManageMemberRoles =
    currentMember?.role === "OWNER";

  async function handleMemberRoleChange(
    member: WorkspaceMember,
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const newRole = event.target
      .value as EditableWorkspaceRole;

    if (!canManageMemberRoles) {
      return;
    }

    const memberUserId =
      member.user?.id ?? member.userId;

    const isCurrentUser =
      memberUserId === currentUserId;

    if (member.role === "OWNER" || isCurrentUser) {
      return;
    }

    if (member.role === newRole) {
      return;
    }

    const previousRole = member.role;

    try {
      setUpdatingMemberId(member.id);

      setMemberUpdateErrors((currentErrors) => {
        const updatedErrors = { ...currentErrors };

        delete updatedErrors[member.id];

        return updatedErrors;
      });

      setMemberUpdateSuccess((currentSuccess) => {
        const updatedSuccess = { ...currentSuccess };

        delete updatedSuccess[member.id];

        return updatedSuccess;
      });

      setMembers((currentMembers) =>
        currentMembers.map((currentMemberItem) =>
          currentMemberItem.id === member.id
            ? {
                ...currentMemberItem,
                role: newRole,
              }
            : currentMemberItem,
        ),
      );

      const response = await updateWorkspaceMemberRole(
        workspaceId,
        member.id,
        {
          role: newRole,
        },
      );

      setMembers((currentMembers) =>
        currentMembers.map((currentMemberItem) =>
          currentMemberItem.id === member.id
            ? {
                ...currentMemberItem,
                ...response.member,
                user:
                  response.member.user ??
                  currentMemberItem.user,
              }
            : currentMemberItem,
        ),
      );

      setMemberUpdateSuccess((currentSuccess) => ({
        ...currentSuccess,
        [member.id]: response.message,
      }));

      window.setTimeout(() => {
        setMemberUpdateSuccess((currentSuccess) => {
          const updatedSuccess = { ...currentSuccess };

          delete updatedSuccess[member.id];

          return updatedSuccess;
        });
      }, 2500);
    } catch (error) {
      setMembers((currentMembers) =>
        currentMembers.map((currentMemberItem) =>
          currentMemberItem.id === member.id
            ? {
                ...currentMemberItem,
                role: previousRole,
              }
            : currentMemberItem,
        ),
      );

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Não foi possível alterar a permissão do membro.";

        setMemberUpdateErrors((currentErrors) => ({
          ...currentErrors,
          [member.id]: message,
        }));

        return;
      }

      setMemberUpdateErrors((currentErrors) => ({
        ...currentErrors,
        [member.id]:
          "Ocorreu um erro inesperado ao alterar a permissão.",
      }));
    } finally {
      setUpdatingMemberId(null);
    }
  }

  if (isLoading) {
    return (
      <section className="workspace-members-section">
        <div
          className="workspace-members-feedback"
          role="status"
        >
          Carregando membros...
        </div>
      </section>
    );
  }

  if (membersError) {
    return (
      <section className="workspace-members-section">
        <div className="workspace-members-error">
          <h2>Não foi possível carregar os membros</h2>

          <p>{membersError}</p>

          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              void loadMembers();
            }}
          >
            Tentar novamente
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="workspace-members-section">
      <header className="workspace-section-header">
        <div>
          <h2>Membros</h2>

          <p>
            Pessoas que possuem acesso a este Workspace.
          </p>
        </div>

        <span className="workspace-members-count">
          {members.length}{" "}
          {members.length === 1 ? "membro" : "membros"}
        </span>
      </header>

      {members.length === 0 ? (
        <div className="workspace-members-empty">
          <h3>Nenhum membro encontrado</h3>

          <p>
            Este Workspace ainda não possui membros cadastrados.
          </p>
        </div>
      ) : (
        <div className="workspace-members-list">
          {members.map((member) => {
            const memberUserId =
              member.user?.id ?? member.userId;

            const isCurrentUser =
              memberUserId === currentUserId;

            const memberName =
              member.user?.name ?? "Usuário";

            const memberEmail =
              member.user?.email ??
              "Email não disponível";

            const memberInitial = memberName
              .charAt(0)
              .toUpperCase();

            const canEditThisMember =
              canManageMemberRoles &&
              member.role !== "OWNER" &&
              !isCurrentUser;

            const isUpdating =
              updatingMemberId === member.id;

            const updateError =
              memberUpdateErrors[member.id];

            const updateSuccess =
              memberUpdateSuccess[member.id];

            return (
              <article
                className="workspace-member-card"
                key={member.id}
              >
                <div className="workspace-member-avatar">
                  {memberInitial}
                </div>

                <div className="workspace-member-info">
                  <div className="workspace-member-name">
                    <strong>{memberName}</strong>

                    {isCurrentUser && (
                      <span className="current-user-badge">
                        Você
                      </span>
                    )}
                  </div>

                  <span>{memberEmail}</span>

                  {updateError && (
                    <span
                      className="workspace-member-update-error"
                      role="alert"
                    >
                      {updateError}
                    </span>
                  )}

                  {updateSuccess && (
                    <span
                      className="workspace-member-update-success"
                      role="status"
                    >
                      {updateSuccess}
                    </span>
                  )}
                </div>

                {canEditThisMember ? (
                  <div className="workspace-member-role-control">
                    <label
                      className="sr-only"
                      htmlFor={`member-role-${member.id}`}
                    >
                      Permissão de {memberName}
                    </label>

                    <select
                      id={`member-role-${member.id}`}
                      className={`workspace-role-select ${
                        workspaceRoleClassNames[member.role]
                      }`}
                      value={member.role}
                      disabled={isUpdating}
                      onChange={(event) => {
                        void handleMemberRoleChange(
                          member,
                          event,
                        );
                      }}
                    >
                      {editableWorkspaceRoles.map((role) => (
                        <option key={role} value={role}>
                          {workspaceRoleLabels[role]}
                        </option>
                      ))}
                    </select>

                    {isUpdating && (
                      <span
                        className="workspace-member-updating"
                        role="status"
                      >
                        Salvando...
                      </span>
                    )}
                  </div>
                ) : (
                  <span
                    className={`workspace-role-badge ${
                      workspaceRoleClassNames[member.role]
                    }`}
                  >
                    {workspaceRoleLabels[member.role]}
                  </span>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}