import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { WorkspaceController } from "../controllers/workspace.controller.js";

const workspaceController = new WorkspaceController();

export async function workspaceRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      preHandler: authMiddleware,
    },
    workspaceController.create
  );

  app.get(
    "/",
    {
      preHandler: authMiddleware,
    },
    workspaceController.list
  );
}