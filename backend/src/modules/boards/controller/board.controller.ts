import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import {
  createBoardParamsSchema,
  createBoardSchema,
} from "../schemas/create-board.schema.js";

import { getBoardSchema } from "../schemas/get-board.schema.js";
import { deleteBoardSchema } from "../schemas/delete-board.schema.js";

import {
  updateBoardBodySchema,
  updateBoardParamsSchema,
} from "../schemas/update-board.schema.js";

import {
  favoriteBoardBodySchema,
  favoriteBoardParamsSchema,
} from "../schemas/favorite-board.schema.js";

import {
  archiveBoardBodySchema,
  archiveBoardParamsSchema,
} from "../schemas/archive-board.schema.js";

import {
  addBoardMemberBodySchema,
  addBoardMemberParamsSchema,
} from "../schemas/add-board-member.schema.js";

import {
  updateBoardMemberRoleBodySchema,
  updateBoardMemberRoleParamsSchema,
} from "../schemas/update-board-member-role.schema.js";
import { removeBoardMemberParamsSchema } from "../schemas/remove-board-member.schema.js";

import { CreateBoardUseCase } from "../use-cases/create-board.use-case.js";
import { ListBoardsUseCase } from "../use-cases/list-boards.use-case.js";
import { GetBoardUseCase } from "../use-cases/get-board.use-case.js";
import { UpdateBoardUseCase } from "../use-cases/update-board.use-case.js";
import { DeleteBoardUseCase } from "../use-cases/delete-board.use-case.js";
import { FavoriteBoardUseCase } from "../use-cases/favorite-board.use-case.js";
import { ArchiveBoardUseCase } from "../use-cases/archive-board.use-case.js";
import { ListArchivedBoardsUseCase } from "../use-cases/list-archived-boards.use-case.js";
import { ListBoardMembersUseCase } from "../use-cases/list-board-members.use-case.js";
import { AddBoardMemberUseCase } from "../use-cases/add-board-member.use-case.js";
import { UpdateBoardMemberRoleUseCase } from "../use-cases/update-board-member-role.use-case.js";
import { RemoveBoardMemberUseCase } from "../use-cases/remove-board-member.use-case.js";

const createBoardUseCase =
  new CreateBoardUseCase();

const listBoardsUseCase =
  new ListBoardsUseCase();

const getBoardUseCase =
  new GetBoardUseCase();

const updateBoardUseCase =
  new UpdateBoardUseCase();

const deleteBoardUseCase =
  new DeleteBoardUseCase();

const favoriteBoardUseCase =
  new FavoriteBoardUseCase();

const archiveBoardUseCase =
  new ArchiveBoardUseCase();

const listArchivedBoardsUseCase =
  new ListArchivedBoardsUseCase();

const listBoardMembersUseCase =
  new ListBoardMembersUseCase();

const addBoardMemberUseCase =
  new AddBoardMemberUseCase();

const updateBoardMemberRoleUseCase =
  new UpdateBoardMemberRoleUseCase();

const removeBoardMemberUseCase =
  new RemoveBoardMemberUseCase();

export class BoardController {
  async create(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { workspaceId } =
      createBoardParamsSchema.parse(
        request.params,
      );

    const data =
      createBoardSchema.parse(
        request.body,
      );

    const board =
      await createBoardUseCase.execute({
        workspaceId,
        userId: request.user.id,
        ...data,
      });

    return reply.status(201).send({
      message: "Board criado com sucesso",
      board,
    });
  }

  async list(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { workspaceId } =
      createBoardParamsSchema.parse(
        request.params,
      );

    const boards =
      await listBoardsUseCase.execute({
        workspaceId,
        userId: request.user.id,
      });

    return reply.status(200).send({
      boards,
    });
  }

  async getById(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { id } =
      getBoardSchema.parse(
        request.params,
      );

    const board =
      await getBoardUseCase.execute({
        boardId: id,
        userId: request.user.id,
      });

    return reply.status(200).send({
      board,
    });
  }

  async update(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { id } =
      updateBoardParamsSchema.parse(
        request.params,
      );

    const data =
      updateBoardBodySchema.parse(
        request.body,
      );

    const board =
      await updateBoardUseCase.execute({
        boardId: id,
        userId: request.user.id,
        ...data,
      });

    return reply.status(200).send({
      message: "Board atualizado com sucesso",
      board,
    });
  }

  async delete(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { id } =
      deleteBoardSchema.parse(
        request.params,
      );

    await deleteBoardUseCase.execute({
      boardId: id,
      userId: request.user.id,
    });

    return reply.status(200).send({
      message: "Board excluído com sucesso",
    });
  }

  async favorite(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { id } =
      favoriteBoardParamsSchema.parse(
        request.params,
      );

    const { isFavorite } =
      favoriteBoardBodySchema.parse(
        request.body,
      );

    const member =
      await favoriteBoardUseCase.execute({
        boardId: id,
        userId: request.user.id,
        isFavorite,
      });

    return reply.status(200).send({
      message: isFavorite
        ? "Board favoritado com sucesso"
        : "Board removido dos favoritos com sucesso",
      member,
    });
  }

  async archive(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { id } =
      archiveBoardParamsSchema.parse(
        request.params,
      );

    const { isArchived } =
      archiveBoardBodySchema.parse(
        request.body,
      );

    const board =
      await archiveBoardUseCase.execute({
        boardId: id,
        userId: request.user.id,
        isArchived,
      });

    return reply.status(200).send({
      message: isArchived
        ? "Board arquivado com sucesso"
        : "Board desarquivado com sucesso",
      board,
    });
  }

  async listArchived(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { workspaceId } =
      createBoardParamsSchema.parse(
        request.params,
      );

    const boards =
      await listArchivedBoardsUseCase.execute({
        workspaceId,
        userId: request.user.id,
      });

    return reply.status(200).send({
      boards,
    });
  }

  async listMembers(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { id } =
      getBoardSchema.parse(
        request.params,
      );

    const members =
      await listBoardMembersUseCase.execute({
        boardId: id,
        userId: request.user.id,
      });

    return reply.status(200).send({
      members,
    });
  }

  async addMember(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { id } =
      addBoardMemberParamsSchema.parse(
        request.params,
      );

    const data =
      addBoardMemberBodySchema.parse(
        request.body,
      );

    const member =
      await addBoardMemberUseCase.execute({
        boardId: id,
        userId: request.user.id,
        ...data,
      });

    return reply.status(201).send({
      message:
        "Membro adicionado ao Board com sucesso",
      member,
    });
  }

  async updateMemberRole(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { id, memberId } =
      updateBoardMemberRoleParamsSchema.parse(
        request.params,
      );

    const { role } =
      updateBoardMemberRoleBodySchema.parse(
        request.body,
      );

    const member =
      await updateBoardMemberRoleUseCase.execute({
        boardId: id,
        memberId,
        userId: request.user.id,
        role,
      });

    return reply.status(200).send({
      message:
        "Permissão do membro atualizada com sucesso",
      member,
    });
  }

  async removeMember(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { id, memberId } =
      removeBoardMemberParamsSchema.parse(
        request.params,
      );

    await removeBoardMemberUseCase.execute({
      boardId: id,
      memberId,
      userId: request.user.id,
    });

    return reply.status(200).send({
      message:
        "Membro removido do Board com sucesso",
    });
  }
}
