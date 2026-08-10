import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import {
  createBoardParamsSchema,
  createBoardSchema,
} from "../schemas/create-board.schema.js";

import { CreateBoardUseCase } from "../use-cases/create-board.use-case.js";
import { ListBoardsUseCase } from "../use-cases/list-boards.use-case.js";

const createBoardUseCase =
  new CreateBoardUseCase();

const listBoardsUseCase =
  new ListBoardsUseCase();

export class BoardController {
  async create(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { workspaceId } =
      createBoardParamsSchema.parse(
        request.params,
      );

    const data = createBoardSchema.parse(
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
}