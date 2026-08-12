import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

type EnsureBoardMemberRequest = {
  boardId: string;
  userId: string;
};

type EnsureBoardRoleRequest = {
  boardId: string;
  userId: string;
  allowedRoles: Array<
    "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"
  >;
};

type EnsureBoardViewAccessRequest = {
  boardId: string;
  userId: string;
};

export class BoardAccessService {
  async ensureMember({
    boardId,
    userId,
  }: EnsureBoardMemberRequest) {
    const member =
      await prisma.boardMember.findUnique({
        where: {
          boardId_userId: {
            boardId,
            userId,
          },
        },
      });

    if (!member) {
      throw new AppError(
        "Board não encontrado.",
        404,
      );
    }

    return member;
  }

  async ensureRole({
    boardId,
    userId,
    allowedRoles,
  }: EnsureBoardRoleRequest) {
    const member = await this.ensureMember({
      boardId,
      userId,
    });

    if (!allowedRoles.includes(member.role)) {
      throw new AppError(
        "Você não tem permissão para realizar esta ação neste Board.",
        403,
      );
    }

    return member;
  }

  async ensureViewAccess({
    boardId,
    userId,
  }: EnsureBoardViewAccessRequest) {
    const board = await prisma.board.findUnique({
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
            userId,
            workspaceId: board.workspaceId,
          },
        },
      });

    if (!workspaceMember) {
      throw new AppError(
        "Board não encontrado.",
        404,
      );
    }

    if (
      workspaceMember.role === "OWNER" ||
      workspaceMember.role === "ADMIN"
    ) {
      return {
        board,
        workspaceMember,
        boardMember: null,
      };
    }

    const boardMember =
      await prisma.boardMember.findUnique({
        where: {
          boardId_userId: {
            boardId,
            userId,
          },
        },
      });

    if (!boardMember) {
      throw new AppError(
        "Board não encontrado.",
        404,
      );
    }

    return {
      board,
      workspaceMember,
      boardMember,
    };
  }
}