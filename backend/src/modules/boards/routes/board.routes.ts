import type { FastifyInstance } from "fastify";

import { authMiddleware } from "../../../middlewares/auth.middleware.js";

import { BoardController } from "../controller/board.controller.js";

const boardController = new BoardController();

export async function boardRoutes(
  app: FastifyInstance,
) {
  app.addHook("preHandler", authMiddleware);

  app.post(
    "/workspaces/:workspaceId/boards",
    boardController.create,
  );

  app.get(
    "/workspaces/:workspaceId/boards",
    boardController.list,
  );

  app.get(
    "/workspaces/:workspaceId/boards/archived",
    boardController.listArchived,
  );

  app.get(
    "/boards/:id",
    boardController.getById,
  );

  app.patch(
    "/boards/:id",
    boardController.update,
  );

  app.patch(
    "/boards/:id/favorite",
    boardController.favorite,
  );

  app.patch(
    "/boards/:id/archive",
    boardController.archive,
  );

  app.delete(
    "/boards/:id",
    boardController.delete,
  );
}