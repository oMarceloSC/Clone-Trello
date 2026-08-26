import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

import type { UpdateBoardMemberRoleBodyInput } from "../schemas/update-board-member-role.schema.js";

import { BoardAccessService } from "../services/board-access.service.js";

type ExecuteRequest =
    UpdateBoardMemberRoleBodyInput & {
        boardId: string;
        memberId: string;
        userId: string;
    };

const boardAccessService =
    new BoardAccessService();

export class UpdateBoardMemberRoleUseCase {
    async execute({
        boardId,
        memberId,
        userId,
        role,
    }: ExecuteRequest) {
        await boardAccessService.ensureRole({
            boardId,
            userId,
            allowedRoles: [
                "OWNER",
            ],
        });

        const targetMember =
            await prisma.boardMember.findFirst({
                where: {
                    id: memberId,
                    boardId,
                },
            });

        if (!targetMember) {
            throw new AppError(
                "Membro não encontrado.",
                404,
            );
        }

        if (targetMember.role === "OWNER") {
            throw new AppError(
                "Não é possível alterar a permissão do OWNER.",
                403,
            );
        }

        if (targetMember.userId === userId) {
            throw new AppError(
                "Você não pode alterar sua própria permissão.",
                403,
            );
        }

        const updatedMember =
            await prisma.boardMember.update({
                where: {
                    id: memberId,
                },

                data: {
                    role,
                },
                select: {
                    id: true,
                    boardId: true,
                    userId: true,
                    role: true,
                    isFavorite: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatarUrl: true,
                        },
                    },
                },
            });

        return updatedMember;
    }
}
