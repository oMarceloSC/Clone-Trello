import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

type ListPendingWorkspaceInvitationsInput = {
  userId: string;
};

export class ListPendingWorkspaceInvitationsUseCase {
  async execute({
    userId,
  }: ListPendingWorkspaceInvitationsInput) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
      },
    });

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    const currentDate = new Date();

    await prisma.workspaceInvitation.updateMany({
      where: {
        email: user.email,
        status: "PENDING",
        expiresAt: {
          lte: currentDate,
        },
      },
      data: {
        status: "EXPIRED",
      },
    });

    const invitations =
      await prisma.workspaceInvitation.findMany({
        where: {
          email: user.email,
          status: "PENDING",
          expiresAt: {
            gt: currentDate,
          },
        },
        select: {
          id: true,
          email: true,
          token: true,
          status: true,
          workspaceId: true,
          invitedById: true,
          expiresAt: true,
          createdAt: true,
          updatedAt: true,

          workspace: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },

          invitedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return {
      invitations,
    };
  }
}