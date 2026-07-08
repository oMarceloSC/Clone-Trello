import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

type ExecuteRequest = {
  token: string;
  userId: string;
};

export class AcceptWorkspaceInvitationUseCase {
  async execute({ token, userId }: ExecuteRequest) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    const invitation = await prisma.workspaceInvitation.findUnique({
      where: {
        token,
      },
    });

    if (!invitation || invitation.status !== "PENDING") {
      throw new AppError("Convite não encontrado ou inválido.", 404);
    }

    if (invitation.email !== user.email) {
      throw new AppError("Este convite não pertence ao usuário autenticado.", 403);
    }

    if (invitation.expiresAt < new Date()) {
      await prisma.workspaceInvitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: "EXPIRED",
        },
      });

      throw new AppError("Convite expirado.", 410);
    }

    const alreadyMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId: invitation.workspaceId,
        },
      },
    });

    if (alreadyMember) {
      throw new AppError("Usuário já é membro deste Workspace.", 409);
    }

    const result = await prisma.$transaction(async (tx) => {
      const workspaceMember = await tx.workspaceMember.create({
        data: {
          userId,
          workspaceId: invitation.workspaceId,
          role: "MEMBER",
        },
      });

      const acceptedInvitation = await tx.workspaceInvitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: "ACCEPTED",
        },
      });

      return {
        workspaceMember,
        invitation: acceptedInvitation,
      };
    });

    return result;
  }
}