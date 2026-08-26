import { prisma } from "../../../lib/prisma.js";
import { Prisma } from "@prisma/client";
import { AppError } from "../../../shared/errors/app-error.js";

import type { AddBoardMemberBodyInput } from "../schemas/add-board-member.schema.js";

import { BoardAccessService } from "../services/board-access.service.js";

type ExecuteRequest =
  AddBoardMemberBodyInput & {
    boardId: string;
    userId: string;
  };

const boardAccessService =
  new BoardAccessService();

export class AddBoardMemberUseCase {
  async execute({
    boardId,
    userId,
    memberUserId,
    role,
  }: ExecuteRequest) {
    await boardAccessService.ensureRole({
      boardId,
      userId,
      allowedRoles: [
        "OWNER",
        "ADMIN",
      ],
    });

    const board =
      await prisma.board.findUnique({
        where: {
          id: boardId,
        },
        select: {
          id: true,
          workspaceId: true,
        },
      });

    if (!board) {
      throw new AppError(
        "Board não encontrado.",
        404,
      );
    }

    const workspaceMember =
      await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: memberUserId,
            workspaceId:
              board.workspaceId,
          },
        },
      });

    if (!workspaceMember) {
      throw new AppError(
        "O usuário precisa pertencer ao Workspace antes de ser adicionado ao Board.",
        400,
      );
    }

    const existingMember =
      await prisma.boardMember.findUnique({
        where: {
          boardId_userId: {
            boardId,
            userId: memberUserId,
          },
        },
      });

    if (existingMember) {
      throw new AppError(
        "Este usuário já é membro do Board.",
        409,
      );
    }

    try {
      const member =
        await prisma.boardMember.create({
          data: {
            boardId,
            userId: memberUserId,
            role,
          },
          select: {
            id: true,
            boardId: true,
            userId: true,
            role: true,
            isFavorite: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        });

      return member;
    } catch (error) {
      if (
        error instanceof
          Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          "Este usuário já é membro do Board.",
          409,
        );
      }

      throw error;
    }
  }
}
