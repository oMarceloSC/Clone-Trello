import { prisma } from "../../../lib/prisma.js";
import { Prisma } from "@prisma/client";
import { AppError } from "../../../shared/errors/app-error.js";

import { BoardAccessService } from "../../boards/services/board-access.service.js";

import type { CreateCardBody } from "../schemas/create-card.schema.js";

type ExecuteRequest = CreateCardBody & {
  listId: string;
  userId: string;
};

const boardAccessService = new BoardAccessService();

export class CreateCardUseCase {
  async execute({ listId, userId, title }: ExecuteRequest) {
    const list = await prisma.boardList.findUnique({
      where: { id: listId },
      select: {
        id: true,
        boardId: true,
      },
    });

    if (!list) {
      throw new AppError("List não encontrada.", 404);
    }

    await boardAccessService.ensureRole({
      boardId: list.boardId,
      userId,
      allowedRoles: ["OWNER", "ADMIN", "MEMBER"],
    });

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await prisma.$transaction(async (tx) => {
          const lastCard = await tx.card.findFirst({
            where: { listId },
            orderBy: { position: "desc" },
            select: { position: true },
          });

          return tx.card.create({
            data: {
              title,
              position: lastCard === null ? 0 : lastCard.position + 1,
              listId,
            },
          });
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      } catch (error) {
        const isAdapterConflict =
          error instanceof Error &&
          error.name === "DriverAdapterError" &&
          "cause" in error &&
          typeof error.cause === "object" &&
          error.cause !== null &&
          "kind" in error.cause &&
          error.cause.kind === "TransactionWriteConflict";

        if (
          !(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") &&
          !isAdapterConflict
        ) {
          throw error;
        }

        if (attempt === 2) {
          throw new AppError(
            "Não foi possível criar o Card devido a alterações simultâneas. Tente novamente.",
            409,
          );
        }
      }
    }

    throw new AppError("Não foi possível criar o Card. Tente novamente.", 409);
  }
}