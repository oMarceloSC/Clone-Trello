import { prisma } from "../../../lib/prisma.js";

import { BoardAccessService } from "../services/board-access.service.js";

type ExecuteRequest = {
  boardId: string;
  userId: string;
};

const boardAccessService =
  new BoardAccessService();

export class ListBoardMembersUseCase {
  async execute({
    boardId,
    userId,
  }: ExecuteRequest) {
    await boardAccessService.ensureViewAccess({
      boardId,
      userId,
    });

    const members =
      await prisma.boardMember.findMany({
        where: {
          boardId,
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
        orderBy: {
          createdAt: "asc",
        },
      });

    return members;
  }
}