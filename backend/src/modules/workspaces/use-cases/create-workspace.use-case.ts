import { prisma } from "../../../lib/prisma.js";
import type { CreateWorkspaceInput } from "../schemas/create-workspace.schema.js";

type ExecuteRequest = CreateWorkspaceInput & {
  userId: string;
};

export class CreateWorkspaceUseCase {
  async execute({ name, description, userId }: ExecuteRequest) {
    const workspace = await prisma.workspace.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId,
            role: "OWNER",
          },
        },
      },
      include: {
        members: true,
      },
    });

    return workspace;
  }
}