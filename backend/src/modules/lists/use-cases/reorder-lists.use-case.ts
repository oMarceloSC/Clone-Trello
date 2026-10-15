import { Prisma } from "@prisma/client";

import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

import { BoardAccessService } from "../../boards/services/board-access.service.js";

import type { ReorderListsInput } from "../schemas/reorder-lists.schema.js";

type ExecuteRequest = ReorderListsInput & {
  boardId: string;
  userId: string;
};

const boardAccessService =
  new BoardAccessService();

export class ReorderListsUseCase {
  async execute({
    boardId,
    userId,
    listIds,
  }: ExecuteRequest) {
    await boardAccessService.ensureRole({
      boardId,
      userId,
      allowedRoles: [
        "OWNER",
        "ADMIN",
        "MEMBER",
      ],
    });

    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await prisma.$transaction(
          async (tx) => {
            const existingLists =
              await tx.boardList.findMany({
                where: {
                  boardId,
                },
                select: {
                  id: true,
                  position: true,
                },
              });

            const existingIds = new Set(
              existingLists.map((list) => list.id),
            );

            const requestedIds = new Set(listIds);

            const isValidOrder =
              existingLists.length === listIds.length &&
              requestedIds.size === listIds.length &&
              listIds.every((id) => existingIds.has(id));

            if (!isValidOrder) {
              throw new AppError(
                "A ordem enviada deve conter todas as Lists do Board, sem IDs inválidos ou duplicados.",
                400,
              );
            }

            const positions = new Map(
              existingLists.map((list) => [
                list.id,
                list.position,
              ]),
            );

            for (
              let index = 0;
              index < listIds.length;
              index++
            ) {
              const listId = listIds[index];

              if (positions.get(listId) === index) {
                continue;
              }

              await tx.boardList.update({
                where: {
                  id: listId,
                },
                data: {
                  position: index,
                },
              });
            }

            return tx.boardList.findMany({
              where: {
                boardId,
              },
              orderBy: [
                {
                  position: "asc",
                },
                {
                  id: "asc",
                },
              ],
            });
          },
          {
            isolationLevel:
              Prisma.TransactionIsolationLevel.Serializable,
          },
        );
      } catch (error) {
        const isSerializationConflict =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2034";

        if (
          !isSerializationConflict ||
          attempt === maxRetries - 1
        ) {
          throw error;
        }
      }
    }

    throw new AppError(
      "Não foi possível reordenar as Lists. Tente novamente.",
      409,
    );
  }
}