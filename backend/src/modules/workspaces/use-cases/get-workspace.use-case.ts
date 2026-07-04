import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

type ExecuteRequest = {
  workspaceId: string;
  userId: string;
};

export class GetWorkspaceUseCase {
  async execute({ workspaceId, userId }: ExecuteRequest) {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!workspace) {
      throw new AppError("Workspace não encontrado.", 404);
    }

    return workspace;
  }
}