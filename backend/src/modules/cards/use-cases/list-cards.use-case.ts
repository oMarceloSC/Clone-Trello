import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

import { BoardAccessService } from "../../boards/services/board-access.service.js";

type ExecuteRequest = {
    listId: string;
    userId: string;
};

const boardAccessService = new BoardAccessService();

export class ListCardsUseCase {
    async execute({ listId, userId }: ExecuteRequest) {
        const list = await prisma.boardList.findUnique({
            where: { id: listId },
            select: {
                id: true,
                boardId: true,
            },
        });

        if (!list) {
            throw new AppError("List não encontrada.", 404);
        }

        await boardAccessService.ensureViewAccess({
            boardId: list.boardId,
            userId,
        });

        const cards = await prisma.card.findMany({
            where: {
                listId,
                isArchived: false,
            },
            orderBy: [
                { position: "asc" },
                { id: "asc" },
            ],
        });

        return cards;
    }
}