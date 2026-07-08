import type { FastifyReply, FastifyRequest } from "fastify";

import { acceptWorkspaceInvitationParamsSchema } from "../schemas/accept-workspace-invitation.schema.js";
import { AcceptWorkspaceInvitationUseCase } from "../use-cases/accept-workspace-invitation.use-case.js";

const acceptWorkspaceInvitationUseCase =
  new AcceptWorkspaceInvitationUseCase();

export class WorkspaceInvitationController {
  async accept(request: FastifyRequest, reply: FastifyReply) {
    const { token } = acceptWorkspaceInvitationParamsSchema.parse(
      request.params
    );

    const result = await acceptWorkspaceInvitationUseCase.execute({
      token,
      userId: request.user.id,
    });

    return reply.status(200).send({
      message: "Convite aceito com sucesso",
      ...result,
    });
  }
}