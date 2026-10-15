import type { FastifyInstance } from "fastify";

import { authMiddleware } from "../../../middlewares/auth.middleware.js";

import { ListController } from "../controller/list.controller.js";

const listController =
  new ListController();

export async function listRoutes(
  app: FastifyInstance,
) {
  app.addHook(
    "preHandler",
    authMiddleware,
  );

  app.post(
    "/boards/:boardId/lists",
    listController.create,
  );

  app.get(
    "/boards/:boardId/lists",
    listController.list,
  );

  app.patch(
    "/lists/:id",
    listController.update,
  );

  app.delete(
    "/lists/:id",
    listController.delete,
  );

  app.patch(
    "/boards/:boardId/lists/reorder",
    listController.reorder,
  );
}