import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import {
  createBoardParamsSchema,
  createBoardSchema,
} from "../schemas/create-board.schema.js";

import { getBoardSchema } from "../schemas/get-board.schema.js";

import {
  updateBoardBodySchema,
  updateBoardParamsSchema,
} from "../schemas/update-board.schema.js";

import { CreateBoardUseCase } from "../use-cases/create-board.use-case.js";
import { ListBoardsUseCase } from "../use-cases/list-boards.use-case.js";
import { GetBoardUseCase } from "../use-cases/get-board.use-case.js";
import { UpdateBoardUseCase } from "../use-cases/update-board.use-case.js";

const createBoardUseCase =
  new CreateBoardUseCase();

const listBoardsUseCase =
  new ListBoardsUseCase();

const getBoardUseCase =
  new GetBoardUseCase();

const updateBoardUseCase =
  new UpdateBoardUseCase();

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
}