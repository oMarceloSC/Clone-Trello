import { prisma } from "../../../lib/prisma.js";

import type { UpdateBoardBodyInput } from "../schemas/update-board.schema.js";
import { BoardAccessService } from "../services/board-access.service.js";

type ExecuteRequest = UpdateBoardBodyInput & {
  boardId: string;
  userId: string;
};

const boardAccessService =
  new BoardAccessService();

export class UpdateBoardUseCase {
  async execute({
    boardId,
    userId,
    title,
    description,
    backgroundColor,
    coverImage,
  }: ExecuteRequest) {
    await boardAccessService.ensureRole({
      boardId,
      userId,
      allowedRoles: [
        "OWNER",
        "ADMIN",
      ],
    });

    const board = await prisma.board.update({
      where: {
        id: boardId,
      },
      data: {
        title,
        description,
        backgroundColor,
        coverImage,
      },
    });

    return board;
  }
}