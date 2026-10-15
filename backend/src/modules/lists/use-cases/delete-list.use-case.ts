import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

import { BoardAccessService } from "../../boards/services/board-access.service.js";

type ExecuteRequest = {
    listId: string;
    userId: string;
};

const boardAccessService =
    new BoardAccessService();

export class DeleteListUseCase {
    async execute({
        listId,
        userId,
    }: ExecuteRequest) {
        const existingList =
            await prisma.boardList.findUnique({
                where: {
                    id: listId,
                },
                select: {
                    id: true,
                    boardId: true,
                },
            });

        if (!existingList) {
            throw new AppError(
                "Lista não encontrada.",
                404,
            );
        }

        await boardAccessService.ensureRole({
            boardId: existingList.boardId,
            userId,
            allowedRoles: [
                "OWNER",
                "ADMIN",
                "MEMBER",
            ],
        });

        await prisma.$transaction(async (tx) => {
            await tx.boardList.delete({
                where: {
                    id: listId,
                },
            });

            const remainingLists =
                await tx.boardList.findMany({
                    where: {
                        boardId: existingList.boardId,
                    },
                    orderBy: [
                        {
                            position: "asc",
                        },
                        {
                            createdAt: "asc",
                        },
                        {
                            id: "asc",
                        },
                    ],
                    select: {
                        id: true,
                        position: true,
                    },
                });

            for (
                let index = 0;
                index < remainingLists.length;
                index++
            ) {
                const list = remainingLists[index];

                if (list.position === index) {
                    continue;
                }

                await tx.boardList.update({
                    where: {
                        id: list.id,
                    },
                    data: {
                        position: index,
                    },
                });
            }
        });
    }
}