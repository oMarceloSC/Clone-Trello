import { Prisma } from "@prisma/client";

import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

import { BoardAccessService } from "../../boards/services/board-access.service.js";

type ExecuteRequest = {
  id: string;
  userId: string;
};

const boardAccessService = new BoardAccessService();

export class DeleteCardUseCase {
  async execute({
    id,
    userId 
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
              throw new AppError(
                "Card não encontrado.",
                404,
              );
            }

            await boardAccessService.ensureRole({
              boardId: card.list.boardId,
              userId,
              allowedRoles: ["OWNER", "ADMIN", "MEMBER"],
            });

            await tx.card.delete({
              where: { id },
            });

            if (!card.isArchived) {
              const remainingCards = await tx.card.findMany({
                where: {
                  listId: card.listId,
                  isArchived: false,
                },
                orderBy: [
                  { position: "asc" },
                  { id: "asc" },
                ],
                select: {
                  id: true,
                  position: true,
                },
              });

              for (let index = 0; index < remainingCards.length; index++) {
                const remainingCard = remainingCards[index];

                if (remainingCard.position !== index) {
                  await tx.card.update({
                    where: {
                      id: remainingCard.id,
                    },
                    data: {
                      position: index,
                    },
                  });
                }
              }
            }

            return {
              message: "Card excluído com sucesso.",
            };
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
            "Não foi possível excluir o Card devido a alterações simultâneas. Tente novamente.",
            409,
          );
        }
      }
    }

    throw new AppError(
      "Não foi possível excluir o Card. Tente novamente.",
      409,
    );
  }
}