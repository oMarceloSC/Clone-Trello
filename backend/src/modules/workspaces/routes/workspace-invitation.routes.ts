import type { FastifyInstance } from "fastify";

import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { WorkspaceInvitationController } from "../controllers/workspace-invitation.controller.js";

const workspaceInvitationController =
  new WorkspaceInvitationController();

export async function workspaceInvitationRoutes(
  app: FastifyInstance,
) {
  app.addHook("preHandler", authMiddleware);

  app.get(
    "/pending",
    workspaceInvitationController.listPending,
  );

  app.post(
    "/:token/accept",
    workspaceInvitationController.accept,
  );
}