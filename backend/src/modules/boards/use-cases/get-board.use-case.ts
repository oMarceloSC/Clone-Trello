import { prisma } from "../../../lib/prisma.js";

import { BoardAccessService } from "../services/board-access.service.js";

type ExecuteRequest = {
  boardId: string;
  userId: string;
};

const boardAccessService =
  new BoardAccessService();

export class GetBoardUseCase {
  async execute({
    boardId,
    userId,
  }: ExecuteRequest) {
    await boardAccessService.ensureViewAccess({
      boardId,
      userId,
    });

    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return board;
  }
}