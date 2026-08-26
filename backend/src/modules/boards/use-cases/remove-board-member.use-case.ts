import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

import { BoardAccessService } from "../services/board-access.service.js";

type ExecuteRequest = {
  boardId: string;
  memberId: string;
  userId: string;
};

const boardAccessService =
  new BoardAccessService();

export class RemoveBoardMemberUseCase {
  async execute({
    boardId,
    memberId,
    userId,
  }: ExecuteRequest) {
    await boardAccessService.ensureRole({
      boardId,
      userId,
      allowedRoles: ["OWNER"],
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
        "O proprietário do Board não pode ser removido.",
        403,
      );
    }

    if (targetMember.userId === userId) {
      throw new AppError(
        "Você não pode remover a si próprio do Board.",
        403,
      );
    }

    await prisma.boardMember.delete({
      where: {
        id: targetMember.id,
      },
    });
  }
}
