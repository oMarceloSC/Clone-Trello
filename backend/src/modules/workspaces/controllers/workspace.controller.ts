import type { FastifyReply, FastifyRequest } from "fastify";
import { createWorkspaceSchema } from "../schemas/create-workspace.schema.js";
import { CreateWorkspaceUseCase } from "../use-cases/create-workspace.use-case.js";

const createWorkspaceUseCase = new CreateWorkspaceUseCase();

export class WorkspaceController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const data = createWorkspaceSchema.parse(request.body);

    const workspace = await createWorkspaceUseCase.execute({
      ...data,
      userId: request.user.id,
    });

    return reply.status(201).send({
      message: "Workspace criado com sucesso",
      workspace,
    });
  }
}