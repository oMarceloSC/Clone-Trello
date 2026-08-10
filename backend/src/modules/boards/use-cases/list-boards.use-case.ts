import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

type ExecuteRequest = {
    workspaceId: string;
    userId: string;
};

export class ListBoardsUseCase {
    async execute({
        workspaceId,
        userId,
    }: ExecuteRequest) {
        const workspaceMember = 
            await prisma.workspaceMember.findUnique({
                where: {
                    userId_workspaceId: {
                        userId,
                        workspaceId,
                    },
                },
            });

        if (!workspaceMember) {
            throw new AppError(
                "Workspace não encontrado.",
                404,
            );
        }

        const boards = await prisma.board.findMany({
            where: {
                workspaceId,
                isArchived: false,
            },
            include: {
                members: {
                    where: {
                        userId,
                    },
                    select: {
                        id: true,
                        userId: true,
                        role: true,
                        isFavorite: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return boards;
    }
}