import { prisma } from "../../../lib/prisma.js";
import { BoardAccessService } from "../services/board-access.service.js";

type ExecuteRequest = {
    boardId: string;
    userId: string;
};

const boardAccessService = 
    new BoardAccessService();

export class DeleteBoardUseCase {
    async execute({
        boardId,
        userId,
    }: ExecuteRequest) {
        await boardAccessService.ensureRole({
            boardId,
            userId,
            allowedRoles: ["OWNER"],
        });

        await prisma.board.delete({
            where: {
                id: boardId,
            },
        });
    }
}