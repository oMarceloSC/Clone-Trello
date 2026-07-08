import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { WorkspaceController } from "../controllers/workspace.controller.js";

const workspaceController = new WorkspaceController();

export async function workspaceRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authMiddleware);

  app.post("/", workspaceController.create);

  app.get("/", workspaceController.list);

  app.get("/:id", workspaceController.getById);

  app.patch("/:id", workspaceController.update);

  app.delete("/:id", workspaceController.delete);

  app.post("/:id/invitations", workspaceController.invite);
}