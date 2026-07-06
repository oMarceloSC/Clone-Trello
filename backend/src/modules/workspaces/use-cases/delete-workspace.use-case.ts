import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

type ExecuteRequest = {
  workspaceId: string;
  userId: string;
};

export class DeleteWorkspaceUseCase {
  async execute({ workspaceId, userId }: ExecuteRequest) {
    const member = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!member) {
      throw new AppError("Workspace não encontrado.", 404);
    }

    if (member.role !== "OWNER") {
      throw new AppError("Você não tem permissão para excluir este Workspace.", 403);
    }

    await prisma.workspace.delete({
      where: {
        id: workspaceId,
      },
    });
  }
}