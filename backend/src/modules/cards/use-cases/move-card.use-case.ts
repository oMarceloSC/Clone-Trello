import { Prisma } from "@prisma/client";

import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

import { BoardAccessService } from "../../boards/services/board-access.service.js";

import type { MoveCardBody } from "../schemas/move-card.schema.js";

type ExecuteRequest = MoveCardBody & {
  id: string;
  userId: string;
};

const boardAccessService = new BoardAccessService();

export class MoveCardUseCase {
  async execute({
    id,
    userId,
    targetListId,
    position,
  }: ExecuteRequest) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await prisma.$transaction(
          async (tx) => {
            const card = await tx.card.findUnique({
              where: { id },
              select: {
                id: true,
                listId: true,
                isArchived: true,
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

            if (card.isArchived) {
              throw new AppError(
                "Não é possível mover um Card arquivado.",
                400,
              );
            }

            const targetList = await tx.boardList.findUnique({
              where: { id: targetListId },
              select: {
                id: true,
                boardId: true,
              },
            });

            if (!targetList) {
              throw new AppError(
                "List de destino não encontrada.",
                404,
              );
            }

            if (card.list.boardId !== targetList.boardId) {
              throw new AppError(
                "Não é possível mover Cards entre Boards diferentes.",
                400,
              );
            }

            await boardAccessService.ensureRole({
              boardId: card.list.boardId,
              userId,
              allowedRoles: ["OWNER", "ADMIN", "MEMBER"],
            });

            const sourceCards = await tx.card.findMany({
              where: {
                listId: card.listId,
                isArchived: false,
              },
              orderBy: [
                { position: "asc" },
                { id: "asc" },
              ],
              select: { id: true },
            });

            const sameList = card.listId === targetListId;

            if (sameList) {
              const reorderedIds = sourceCards
                .map((item) => item.id)
                .filter((cardId) => cardId !== id);

              if (position > reorderedIds.length) {
                throw new AppError(
                  "Posição de destino inválida.",
                  400,
                );
              }

              reorderedIds.splice(position, 0, id);

              for (let index = 0; index < reorderedIds.length; index++) {
                await tx.card.update({
                  where: { id: reorderedIds[index] },
                  data: { position: index },
                });
              }
            } else {
              const targetCards = await tx.card.findMany({
                where: {
                  listId: targetListId,
                  isArchived: false,
                },
                orderBy: [
                  { position: "asc" },
                  { id: "asc" },
                ],
                select: { id: true },
              });

              if (position > targetCards.length) {
                throw new AppError(
                  "Posição de destino inválida.",
                  400,
                );
              }

              const sourceIds = sourceCards
                .map((item) => item.id)
                .filter((cardId) => cardId !== id);

              const targetIds = targetCards.map(
                (item) => item.id,
              );

              targetIds.splice(position, 0, id);

              await tx.card.update({
                where: { id },
                data: {
                  listId: targetListId,
                  position,
                },
              });

              for (let index = 0; index < sourceIds.length; index++) {
                await tx.card.update({
                  where: { id: sourceIds[index] },
                  data: { position: index },
                });
              }

              for (let index = 0; index < targetIds.length; index++) {
                await tx.card.update({
                  where: { id: targetIds[index] },
                  data: { position: index },
                });
              }
            }

            return tx.card.findUniqueOrThrow({
              where: { id },
            });
          },
          {
            isolationLevel:
              Prisma.TransactionIsolationLevel.Serializable,
          },
        );
      } catch (error) {
        const isAdapterConflict =
          error instanceof Error &&
          error.name === "DriverAdapterError" &&
          "cause" in error &&
          typeof error.cause === "object" &&
          error.cause !== null &&
          "kind" in error.cause &&
          error.cause.kind === "TransactionWriteConflict";

        const isPrismaConflict =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2034";

        if (!isAdapterConflict && !isPrismaConflict) {
          throw error;
        }

        if (attempt === 2) {
          throw new AppError(
            "Não foi possível mover o Card devido a alterações simultâneas. Tente novamente.",
            409,
          );
        }
      }
    }

    throw new AppError(
      "Não foi possível mover o Card. Tente novamente.",
      409,
    );
  }
}