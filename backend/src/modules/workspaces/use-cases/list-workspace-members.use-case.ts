import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

type ExecuteRequest = {
  workspaceId: string;
  userId: string;
};

export class ListWorkspaceMembersUseCase {
  async execute({ workspaceId, userId }: ExecuteRequest) {
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

    const members = await prisma.workspaceMember.findMany({
      where: {
        workspaceId,
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
      orderBy: {
        createdAt: "asc",
      },
    });

    return members;
  }
}