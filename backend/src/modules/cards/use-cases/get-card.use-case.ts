import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

import { BoardAccessService } from "../../boards/services/board-access.service.js";

type ExecuteRequest = {
    id: string;
    userId: string;
};

const boardAccessService = new BoardAccessService();

export class GetCardUseCase {
    async execute({ id, userId }: ExecuteRequest) {
        const card = await prisma.card.findUnique({
            where: {
                id,
            },
            include: {
                list: {
                    select: {
                        id: true,
                        title: true,
                        boardId: true,
                    },
                },
            },
        });

        if (!card) {
            throw new AppError("Card não encontrado.", 404);
        }

        await boardAccessService.ensureViewAccess({
            boardId: card.list.boardId,
            userId,
        });

        return card;
    }
}