import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import { acceptWorkspaceInvitationParamsSchema } from "../schemas/accept-workspace-invitation.schema.js";
import { AcceptWorkspaceInvitationUseCase } from "../use-cases/accept-workspace-invitation.use-case.js";
import { ListPendingWorkspaceInvitationsUseCase } from "../use-cases/list-pending-workspace-invitations.use-case.js";

const acceptWorkspaceInvitationUseCase =
  new AcceptWorkspaceInvitationUseCase();

const listPendingWorkspaceInvitationsUseCase =
  new ListPendingWorkspaceInvitationsUseCase();

export class WorkspaceInvitationController {
  async listPending(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const result =
      await listPendingWorkspaceInvitationsUseCase.execute({
        userId: request.user.id,
      });

    return reply.status(200).send(result);
  }

  async accept(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { token } =
      acceptWorkspaceInvitationParamsSchema.parse(
        request.params,
      );

    const result =
      await acceptWorkspaceInvitationUseCase.execute({
        token,
        userId: request.user.id,
      });

    return reply.status(200).send({
      message: "Convite aceito com sucesso",
      ...result,
    });
  }
}