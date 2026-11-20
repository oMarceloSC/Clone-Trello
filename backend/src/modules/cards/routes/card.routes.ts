import type { FastifyInstance } from "fastify";

import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { CardController } from "../controller/card.controller.js";

const cardController = new CardController();

export async function cardRoutes(app: FastifyInstance) {
    app.post(
        "/lists/:listId/cards",
        {
            preHandler: [authMiddleware],
        },
        cardController.create.bind(cardController),
    );

    app.get(
        "/lists/:listId/cards",
        {
            preHandler: [authMiddleware],
        },
        cardController.list.bind(cardController),
    );

    app.get(
        "/lists/:listId/cards/archived",
        {
            preHandler: [authMiddleware],
        },
        cardController.listArchived.bind(cardController),
    );

    app.get(
        "/cards/:id",
        {
            preHandler: [authMiddleware],
        },
        cardController.get.bind(cardController),
    );

    app.patch(
        "/cards/:id",
        {
            preHandler: [authMiddleware],
        },
        cardController.update.bind(cardController),
    );

    app.patch(
        "/cards/:id/archive",
        {
            preHandler: [authMiddleware],
        },
        cardController.archive.bind(cardController),
    );

    app.patch(
        "/cards/:id/restore",
        {
            preHandler: [authMiddleware],
        },
        cardController.restore.bind(cardController),
    );

    app.patch(
        "/cards/:id/move",
        {
            preHandler: [authMiddleware],
        },
        cardController.move.bind(cardController),
    );

    app.delete(
        "/cards/:id",
        {
            preHandler: [authMiddleware],
        },
        cardController.delete.bind(cardController),
    );
}