import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";
import type { UpdateWorkspaceBodyInput } from "../schemas/update-workspace.schema.js";

type ExecuteRequest = UpdateWorkspaceBodyInput & {
  workspaceId: string;
  userId: string;
};

export class UpdateWorkspaceUseCase {
  async execute({ workspaceId, userId, name, description }: ExecuteRequest) {
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

    if (member.role !== "OWNER" && member.role !== "ADMIN") {
      throw new AppError("Você não tem permissão para atualizar este Workspace.", 403);
    }

    const workspace = await prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        name,
        description,
      },
    });

    return workspace;
  }
}