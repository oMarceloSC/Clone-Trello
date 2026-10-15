import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

import { BoardAccessService } from "../../boards/services/board-access.service.js";

import type { UpdateListInput } from "../schemas/update-list.schema.js";

type ExecuteRequest = UpdateListInput & {
    listId: string;
    userId: string;
};

const boardAccessService =
    new BoardAccessService();

export class UpdateListUseCase {
    async execute({
        listId,
        userId,
        title,
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

        const list = await prisma.boardList.update({
            where: {
                id: listId,
            },
            data: {
                title,
            },
        });

        return list;
    }
}