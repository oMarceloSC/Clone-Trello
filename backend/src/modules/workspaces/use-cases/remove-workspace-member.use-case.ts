import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../shared/errors/app-error.js";

type ExecuteRequest = {
    workspaceId: string;
    memberId: string;
    userId: string;
};

export class RemoveWorkspaceMemberUseCase {
    async execute({ workspaceId, memberId, userId }: ExecuteRequest) {
        const currentMember = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId,
                    workspaceId,
                },
            },
        });

        if (!currentMember) {
            throw new AppError("Workspace não encontrado", 404);
        }

        if (currentMember.role !== "OWNER") {
            throw new AppError("Você não tem permissão para remover membros deste workspace", 403);
        }

        const targetMember = await prisma.workspaceMember.findFirst({
            where: {
                id: memberId,
                workspaceId,
            },
        });

        if (!targetMember) {
            throw new AppError("Membro não encontrado", 404);
        }

        if (targetMember.userId === userId) {
            throw new AppError("O proprietário do Workspace não pode remover a si próprio", 403);
        }

        if (targetMember.role === "OWNER") {
            throw new AppError("O proprietário do Workspace não pode ser removido", 403);
        }

        await prisma.workspaceMember.delete({
            where: {
                id: targetMember.id,
            },
        });
    }
}