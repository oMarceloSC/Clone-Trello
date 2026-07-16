import axios from "axios";
import { useEffect, useState } from "react";

import { listWorkspaceMembers } from "../services/workspace.service";
import type {
  WorkspaceMember,
  WorkspaceRole,
} from "../types/workspace.types";

type WorkspaceMembersSectionProps = {
  workspaceId: string;
  currentUserId?: string;
};

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
            const isCurrentUser =
              member.user?.id === currentUserId ||
              member.userId === currentUserId;

            const memberName =
              member.user?.name ?? "Usuário";

            const memberEmail =
              member.user?.email ?? "Email não disponível";

            const memberInitial = memberName
              .charAt(0)
              .toUpperCase();

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
                </div>

                <span
                  className={`workspace-role-badge ${
                    workspaceRoleClassNames[member.role]
                  }`}
                >
                  {workspaceRoleLabels[member.role]}
                </span>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}