import { prisma } from "../../../lib/prisma.js";

import { BoardAccessService } from "../../boards/services/board-access.service.js";

type ExecuteRequest = {
    boardId: string;
    userId: string;
};

const boardAccessService =
    new BoardAccessService();

export class ListListsUseCase {
    async execute({
        boardId,
        userId,
    }: ExecuteRequest) {
        await boardAccessService.ensureViewAccess({
            boardId,
            userId,
        });

        const lists = await prisma.boardList.findMany({
            where: {
                boardId,
            },
            orderBy: {
                position: "asc",
            },
        });

        return lists;
    }
}