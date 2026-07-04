import type { FastifyReply, FastifyRequest } from "fastify";

import { createWorkspaceSchema } from "../schemas/create-workspace.schema.js";
import { getWorkspaceSchema } from "../schemas/get-workspace.schema.js";

import { CreateWorkspaceUseCase } from "../use-cases/create-workspace.use-case.js";
import { ListWorkspacesUseCase } from "../use-cases/list-workspaces.use-case.js";
import { GetWorkspaceUseCase } from "../use-cases/get-workspace.use-case.js";

const createWorkspaceUseCase = new CreateWorkspaceUseCase();
const listWorkspacesUseCase = new ListWorkspacesUseCase();
const getWorkspaceUseCase = new GetWorkspaceUseCase();

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

  async list(request: FastifyRequest, reply: FastifyReply) {
    const workspaces = await listWorkspacesUseCase.execute({
      userId: request.user.id,
    });

    return reply.status(200).send({
      workspaces,
    });
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = getWorkspaceSchema.parse(request.params);

    const workspace = await getWorkspaceUseCase.execute({
      workspaceId: id,
      userId: request.user.id,
    });

    return reply.status(200).send({
      workspace,
    });
  }
}