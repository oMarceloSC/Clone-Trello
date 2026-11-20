import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

import { BoardAccessService } from "../../boards/services/board-access.service.js";

import type { UpdateCardBody } from "../schemas/update-card.schema.js";

type ExecuteRequest = UpdateCardBody & {
  id: string;
  userId: string;
};

const boardAccessService = new BoardAccessService();

export class UpdateCardUseCase {
  async execute({
    id,
    userId,
    title,
    description,
    dueDate,
  }: ExecuteRequest) {
    const card = await prisma.card.findUnique({
      where: { id },
      select: {
        id: true,
        list: {
          select: {
            boardId: true,
          },
        },
      },
    });

    if (!card) {
      throw new AppError("Card não encontrado.", 404);
    }

    await boardAccessService.ensureRole({
      boardId: card.list.boardId,
      userId,
      allowedRoles: ["OWNER", "ADMIN", "MEMBER"],
    });

    const updatedCard = await prisma.card.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(dueDate !== undefined && {
          dueDate: dueDate === null ? null : new Date(dueDate),
        }),
      },
    });

    return updatedCard;
  }
}