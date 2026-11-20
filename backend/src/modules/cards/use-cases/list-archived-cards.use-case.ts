
import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

import { BoardAccessService } from "../../boards/services/board-access.service.js";

type ExecuteRequest = {
    listId: string;
    userId: string;
};

const boardAccessService = new BoardAccessService();

export class ListArchivedCardsUseCase {
    async execute({ listId, userId }: ExecuteRequest) {
        // Verifica se a List existe.
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

        // Verifica se o usuário possui acesso ao Board.
        await boardAccessService.ensureViewAccess({
            boardId: list.boardId,
            userId,
        });

        // Consulta somente os Cards arquivados da List.
        const cards = await prisma.card.findMany({
            where: {
                listId,
                isArchived: true,
            },
            orderBy: [
                { position: "asc" },
                { id: "asc" },
            ],
        });

        return cards;
    }
}
