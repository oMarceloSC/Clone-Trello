import { prisma } from "../../../lib/prisma.js";

import { BoardAccessService } from "../services/board-access.service.js";

type ExecuteRequest = {
  boardId: string;
  userId: string;
  isFavorite: boolean;
};

const boardAccessService =
  new BoardAccessService();

export class FavoriteBoardUseCase {
  async execute({
    boardId,
    userId,
    isFavorite,
  }: ExecuteRequest) {
    await boardAccessService.ensureMember({
      boardId,
      userId,
    });

    const member =
      await prisma.boardMember.update({
        where: {
          boardId_userId: {
            boardId,
            userId,
          },
        },
        data: {
          isFavorite,
        },
      });

    return member;
  }
}