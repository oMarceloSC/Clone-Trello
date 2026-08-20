import { prisma } from "../../../lib/prisma.js";

import { BoardAccessService } from "../services/board-access.service.js";

type ExecuteRequest = {
    boardId: string;
    userId: string;
    isArchived: boolean;
};

const boardAccessService =
    new BoardAccessService();

export class ArchiveBoardUseCase {
    async execute({
        boardId,
        userId,
        isArchived,
    }: ExecuteRequest) {
        await boardAccessService.ensureRole({
            boardId,
            userId,
            allowedRoles: [
                "OWNER",
                "ADMIN",
            ],
        });

        const board =
            await prisma.board.update({
                where: {
                    id: boardId,
                },
                data: {
                    isArchived,
                },
                include: {
                    members: {
                        where: {
                            userId,
                        },
                        select: {
                            id: true,
                            userId: true,
                            isFavorite: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
            });

        return board;
    }
}