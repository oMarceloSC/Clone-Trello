import { prisma } from "../../../lib/prisma.js";
import { Prisma } from "@prisma/client";
import { AppError } from "../../../shared/errors/app-error.js";

import { BoardAccessService } from "../../boards/services/board-access.service.js";

import type { CreateListInput } from "../schemas/create-list.schema.js";

type ExecuteRequest = CreateListInput & {
  boardId: string;
  userId: string;
};

const boardAccessService =
  new BoardAccessService();

export class CreateListUseCase {
  async execute({
    boardId,
    userId,
    title,
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

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await prisma.$transaction(async (tx) => {
          const lastList = await tx.boardList.findFirst({
            where: { boardId },
            orderBy: { position: "desc" },
            select: { position: true },
          });
          return tx.boardList.create({
            data: { title, position: lastList === null ? 0 : lastList.position + 1, boardId },
          });
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      } catch (error) {
        const isAdapterConflict = error instanceof Error && error.name === "DriverAdapterError"
          && "cause" in error && typeof error.cause === "object" && error.cause !== null
          && "kind" in error.cause && error.cause.kind === "TransactionWriteConflict";
        if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") && !isAdapterConflict) throw error;
        if (attempt === 2) throw new AppError("Não foi possível criar a List devido a alterações simultâneas. Tente novamente.", 409);
      }
    }
    throw new AppError("Não foi possível criar a List. Tente novamente.", 409);
  }
}
