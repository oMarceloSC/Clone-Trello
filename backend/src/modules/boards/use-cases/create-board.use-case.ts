import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

import type { CreateBoardInput } from "../schemas/create-board.schema.js";

type ExecuteRequest = CreateBoardInput & {
  workspaceId: string;
  userId: string;
};

export class CreateBoardUseCase {
  async execute({
    workspaceId,
    userId,
    title,
    description,
    backgroundColor,
    coverImage,
  }: ExecuteRequest) {
    const workspaceMember =
      await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId,
            workspaceId,
          },
        },
      });

    if (!workspaceMember) {
      throw new AppError(
        "Workspace não encontrado.",
        404,
      );
    }

    if (workspaceMember.role === "VIEWER") {
      throw new AppError(
        "Você não tem permissão para criar Boards neste Workspace.",
        403,
      );
    }

    const board = await prisma.board.create({
      data: {
        title,
        description,
        backgroundColor,
        coverImage,
        workspaceId,
        createdById: userId,
        members: {
          create: {
            userId,
            role: "OWNER",
          },
        },
      },
      include: {
        members: true,
      },
    });

    return board;
  }
}