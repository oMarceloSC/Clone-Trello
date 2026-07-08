import crypto from "node:crypto";

import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";
import type { InviteWorkspaceMemberBodyInput } from "../schemas/invite-workspace-member.schema.js";

type ExecuteRequest = InviteWorkspaceMemberBodyInput & {
  workspaceId: string;
  userId: string;
};

export class InviteWorkspaceMemberUseCase {
  async execute({ workspaceId, userId, email }: ExecuteRequest) {
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
      throw new AppError("Você não tem permissão para convidar membros.", 403);
    }

    const invitedUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (invitedUser) {
      const alreadyMember = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: invitedUser.id,
            workspaceId,
          },
        },
      });

      if (alreadyMember) {
        throw new AppError("Este usuário já é membro do Workspace.", 409);
      }
    }

    const existingPendingInvitation =
      await prisma.workspaceInvitation.findFirst({
        where: {
          workspaceId,
          email,
          status: "PENDING",
        },
      });

    if (existingPendingInvitation) {
      throw new AppError("Já existe um convite pendente para este email.", 409);
    }

    const token = crypto.randomUUID();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await prisma.workspaceInvitation.create({
      data: {
        email,
        token,
        workspaceId,
        invitedById: userId,
        expiresAt,
      },
    });

    return invitation;
  }
}