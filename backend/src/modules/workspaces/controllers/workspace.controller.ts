import type { FastifyReply, FastifyRequest } from "fastify";

import { createWorkspaceSchema } from "../schemas/create-workspace.schema.js";
import { getWorkspaceSchema } from "../schemas/get-workspace.schema.js";
import {
  updateWorkspaceBodySchema,
  updateWorkspaceParamsSchema,
} from "../schemas/update-workspace.schema.js";
import { deleteWorkspaceParamsSchema } from "../schemas/delete-workspace.schema.js";
import {
  inviteWorkspaceMemberBodySchema,
  inviteWorkspaceMemberParamsSchema,
} from "../schemas/invite-workspace-member.schema.js";
import { listWorkspaceMembersParamsSchema } from "../schemas/list-workspace-members.schema.js";
import {
  updateWorkspaceMemberRoleBodySchema,
  updateWorkspaceMemberRoleParamsSchema,
} from "../schemas/update-workspace-member-role.schema.js";
import { removeWorkspaceMemberParamsSchema } from "../schemas/remove-workspace-member.schema.js";

import { CreateWorkspaceUseCase } from "../use-cases/create-workspace.use-case.js";
import { ListWorkspacesUseCase } from "../use-cases/list-workspaces.use-case.js";
import { GetWorkspaceUseCase } from "../use-cases/get-workspace.use-case.js";
import { UpdateWorkspaceUseCase } from "../use-cases/update-workspace.use-case.js";
import { DeleteWorkspaceUseCase } from "../use-cases/delete-workspace.use-case.js";
import { InviteWorkspaceMemberUseCase } from "../use-cases/invite-workspace-member.use-case.js";
import { ListWorkspaceMembersUseCase } from "../use-cases/list-workspace-members.use-case.js";
import { UpdateWorkspaceMemberRoleUseCase } from "../use-cases/update-workspace-member-role.use-case.js";
import { RemoveWorkspaceMemberUseCase } from "../use-cases/remove-workspace-member.use-case.js";

const createWorkspaceUseCase = new CreateWorkspaceUseCase();
const listWorkspacesUseCase = new ListWorkspacesUseCase();
const getWorkspaceUseCase = new GetWorkspaceUseCase();
const updateWorkspaceUseCase = new UpdateWorkspaceUseCase();
const deleteWorkspaceUseCase = new DeleteWorkspaceUseCase();
const inviteWorkspaceMemberUseCase = new InviteWorkspaceMemberUseCase();
const listWorkspaceMembersUseCase = new ListWorkspaceMembersUseCase();
const updateWorkspaceMemberRoleUseCase =
  new UpdateWorkspaceMemberRoleUseCase();
const removeWorkspaceMemberUseCase = new RemoveWorkspaceMemberUseCase();

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

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = updateWorkspaceParamsSchema.parse(request.params);
    const data = updateWorkspaceBodySchema.parse(request.body);

    const workspace = await updateWorkspaceUseCase.execute({
      workspaceId: id,
      userId: request.user.id,
      ...data,
    });

    return reply.status(200).send({
      message: "Workspace atualizado com sucesso",
      workspace,
    });
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = deleteWorkspaceParamsSchema.parse(request.params);

    await deleteWorkspaceUseCase.execute({
      workspaceId: id,
      userId: request.user.id,
    });

    return reply.status(200).send({
      message: "Workspace excluído com sucesso",
    });
  }

  async invite(request: FastifyRequest, reply: FastifyReply) {
    const { id } = inviteWorkspaceMemberParamsSchema.parse(request.params);
    const data = inviteWorkspaceMemberBodySchema.parse(request.body);

    const invitation = await inviteWorkspaceMemberUseCase.execute({
      workspaceId: id,
      userId: request.user.id,
      ...data,
    });

    return reply.status(201).send({
      message: "Convite criado com sucesso",
      invitation,
    });
  }

  async listMembers(request: FastifyRequest, reply: FastifyReply) {
    const { id } = listWorkspaceMembersParamsSchema.parse(request.params);

    const members = await listWorkspaceMembersUseCase.execute({
      workspaceId: id,
      userId: request.user.id,
    });

    return reply.status(200).send({
      members,
    });
  }

  async updateMemberRole(request: FastifyRequest, reply: FastifyReply) {
    const { id, memberId } = updateWorkspaceMemberRoleParamsSchema.parse(
      request.params
    );

    const { role } = updateWorkspaceMemberRoleBodySchema.parse(request.body);

    const member = await updateWorkspaceMemberRoleUseCase.execute({
      workspaceId: id,
      memberId,
      userId: request.user.id,
      role,
    });

    return reply.status(200).send({
      message: "Permissão atualizada com sucesso",
      member,
    });
  }

  async removeMember(request: FastifyRequest, reply: FastifyReply) {
    const { id, memberId } = removeWorkspaceMemberParamsSchema.parse(
      request.params
    );

    await removeWorkspaceMemberUseCase.execute({
      workspaceId: id,
      memberId,
      userId: request.user.id,
    });

    return reply.status(200).send({
      message: "Membro removido com sucesso",
    });
  }
}