import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

import { BoardAccessService } from "../../boards/services/board-access.service.js";

type ExecuteRequest = {
    id: string;
    userId: string;
    isArchived: boolean;
};

const boardAccessService = new BoardAccessService();

export class ArchiveCardUseCase {
    async execute({
        id,
        userId,
        isArchived,
    }: ExecuteRequest) {
        const card = await prisma.card.findUnique({
            where: { id },
            select: {
                id: true,
                isArchived: true,
                list: {
                    select: {
                        boardId: true,
                    },
                },
            },
        });

        if (!card) {
            throw new AppError("Card não encontrado.", 404);
        }

        await boardAccessService.ensureRole({
            boardId: card.list.boardId,
            userId,
            allowedRoles: ["OWNER", "ADMIN", "MEMBER"],
        });

        if (card.isArchived === isArchived) {
            return prisma.card.findUniqueOrThrow({
                where: { id },
            });
        }

        const updatedCard = await prisma.card.update({
            where: { id },
            data: {
                isArchived,
            },
        });

        return updatedCard;
    }
}