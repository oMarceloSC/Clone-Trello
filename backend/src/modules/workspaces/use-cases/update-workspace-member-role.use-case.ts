import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

type ExecuteRequest = {
  workspaceId: string;
  memberId: string;
  userId: string;
  role: "ADMIN" | "MEMBER" | "VIEWER";
};

export class UpdateWorkspaceMemberRoleUseCase {
  async execute({ workspaceId, memberId, userId, role }: ExecuteRequest) {
    const currentMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!currentMember) {
      throw new AppError("Workspace não encontrado.", 404);
    }

    if (currentMember.role !== "OWNER") {
      throw new AppError(
        "Você não tem permissão para alterar permissões neste Workspace.",
        403
      );
    }

    const targetMember = await prisma.workspaceMember.findFirst({
      where: {
        id: memberId,
        workspaceId,
      },
    });

    if (!targetMember) {
      throw new AppError("Membro não encontrado.", 404);
    }

    if (targetMember.role === "OWNER") {
      throw new AppError("Não é possível alterar a permissão do OWNER.", 403);
    }

    if (targetMember.userId === userId) {
      throw new AppError("Você não pode alterar sua própria permissão.", 403);
    }

    const updatedMember = await prisma.workspaceMember.update({
      where: {
        id: memberId,
      },
      data: {
        role,
      },
      select: {
        id: true,
        role: true,
        createdAt: true,
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

    return updatedMember;
  }
}