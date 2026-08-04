import axios from "axios";
import { useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router";

import { acceptWorkspaceInvitation } from "../services/workspace.service";

export function AcceptWorkspaceInvitationPage() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [isAccepting, setIsAccepting] =
    useState(false);

  const [acceptError, setAcceptError] =
    useState<string | null>(null);

  const [acceptSuccess, setAcceptSuccess] =
    useState<string | null>(null);

  const [workspaceId, setWorkspaceId] =
    useState<string | null>(null);

  async function handleAcceptInvitation() {
    if (!token) {
      setAcceptError(
        "Token do convite não foi informado.",
      );

      return;
    }

    try {
      setIsAccepting(true);
      setAcceptError(null);
      setAcceptSuccess(null);

      const response =
        await acceptWorkspaceInvitation(token);

      setAcceptSuccess(response.message);

      setWorkspaceId(
        response.workspaceMember.workspaceId ??
          response.invitation.workspaceId,
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Não foi possível aceitar o convite.";

        setAcceptError(message);
        return;
      }

      setAcceptError(
        "Ocorreu um erro inesperado ao aceitar o convite.",
      );
    } finally {
      setIsAccepting(false);
    }
  }

  function handleOpenWorkspace() {
    if (!workspaceId) {
      return;
    }

    navigate(`/workspaces/${workspaceId}`, {
      replace: true,
    });
  }

  return (
    <main className="accept-invitation-page">
      <section className="accept-invitation-card">
        <div
          className="accept-invitation-icon"
          aria-hidden="true"
        >
          +
        </div>

        <span className="accept-invitation-label">
          Convite de Workspace
        </span>

        <h1>Participar do Workspace</h1>

        {!acceptSuccess ? (
          <p>
            Você recebeu um convite para participar de um
            Workspace. Confirme abaixo para entrar como membro.
          </p>
        ) : (
          <p>
            O convite foi aceito e sua conta foi adicionada ao
            Workspace.
          </p>
        )}

        {acceptError && (
          <div className="api-error" role="alert">
            {acceptError}
          </div>
        )}

        {acceptSuccess && (
          <div
            className="success-message"
            role="status"
          >
            {acceptSuccess}
          </div>
        )}

        <div className="accept-invitation-actions">
          {!acceptSuccess ? (
            <>
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/dashboard")}
                disabled={isAccepting}
              >
                Voltar ao Dashboard
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  void handleAcceptInvitation();
                }}
                disabled={isAccepting || !token}
              >
                {isAccepting
                  ? "Aceitando..."
                  : "Aceitar convite"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/dashboard")}
              >
                Ir para o Dashboard
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={handleOpenWorkspace}
                disabled={!workspaceId}
              >
                Abrir Workspace
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}