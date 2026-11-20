import type { FastifyRequest, FastifyReply } from "fastify";

import {
  createCardParamsSchema,
  createCardBodySchema,
} from "../schemas/create-card.schema.js";
import { listCardsParamsSchema } from "../schemas/list-cards.schema.js";
import { getCardParamsSchema } from "../schemas/get-card.schema.js";
import {
  updateCardParamsSchema,
  updateCardBodySchema,
} from "../schemas/update-card.schema.js";
import { archiveCardParamsSchema } from "../schemas/archive-card.schema.js";
import {
  moveCardParamsSchema,
  moveCardBodySchema,
} from "../schemas/move-card.schema.js";
import { deleteCardParamsSchema } from "../schemas/delete-card.schema.js";

import { CreateCardUseCase } from "../use-cases/create-card.use-case.js";
import { ListCardsUseCase } from "../use-cases/list-cards.use-case.js";
import { GetCardUseCase } from "../use-cases/get-card.use-case.js";
import { UpdateCardUseCase } from "../use-cases/update-card.use-case.js";
import { ArchiveCardUseCase } from "../use-cases/archive-card.use-case.js";
import { MoveCardUseCase } from "../use-cases/move-card.use-case.js";
import { DeleteCardUseCase } from "../use-cases/delete-card.use-case.js";
import { ListArchivedCardsUseCase } from "../use-cases/list-archived-cards.use-case.js";

export class CardController {
  async create(
    request: FastifyRequest, 
    reply: FastifyReply) {

      const { listId } = createCardParamsSchema.parse(request.params);
      const { title } = createCardBodySchema.parse(request.body);

      const createCardUseCase = new CreateCardUseCase();

      const card = await createCardUseCase.execute({
        listId,
        userId: request.user.id,
        title,
      });

      return reply.status(201).send({
        message: "Card criado com sucesso.",
        card,
      });
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const { listId } = listCardsParamsSchema.parse(request.params);

    const listCardsUseCase = new ListCardsUseCase();

    const cards = await listCardsUseCase.execute({
      listId,
      userId: request.user.id,
    });

    return reply.status(200).send({
      cards,
    });
  }

  async get(request: FastifyRequest, reply: FastifyReply) {
    const { id } = getCardParamsSchema.parse(request.params);

    const getCardUseCase = new GetCardUseCase();

    const card = await getCardUseCase.execute({
      id,
      userId: request.user.id,
    });

    return reply.status(200).send({
      card,
    });
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = updateCardParamsSchema.parse(request.params);

    const { title, description, dueDate } =
      updateCardBodySchema.parse(request.body);

    const updateCardUseCase = new UpdateCardUseCase();

    const card = await updateCardUseCase.execute({
      id,
      userId: request.user.id,
      title,
      description,
      dueDate,
    });

    return reply.status(200).send({
      message: "Card atualizado com sucesso.",
      card,
    });
  }

  async archive(request: FastifyRequest, reply: FastifyReply) {
    const { id } = archiveCardParamsSchema.parse(request.params);

    const archiveCardUseCase = new ArchiveCardUseCase();

    const card = await archiveCardUseCase.execute({
      id,
      userId: request.user.id,
      isArchived: true,
    });

    return reply.status(200).send({
      message: "Card arquivado com sucesso.",
    });
  }

  async restore(request: FastifyRequest, reply: FastifyReply) {
    const { id } = archiveCardParamsSchema.parse(request.params);

    const archiveCardUseCase = new ArchiveCardUseCase();

    const card = await archiveCardUseCase.execute({
      id,
      userId: request.user.id,
      isArchived: false,
    });

    return reply.status(200).send({
      message: "Card restaurado com sucesso.",
      card,
    });
  }

  async move(request: FastifyRequest, reply: FastifyReply) {
    const { id } = moveCardParamsSchema.parse(request.params);

    const { targetListId, position } =
      moveCardBodySchema.parse(request.body);

    const moveCardUseCase = new MoveCardUseCase();

    const card = await moveCardUseCase.execute({
      id,
      userId: request.user.id,
      targetListId,
      position,
    });

    return reply.status(200).send({
      message: "Card movimentado com sucesso",
      card,
    });
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = deleteCardParamsSchema.parse(request.params);

    const deleteCardUseCase = new DeleteCardUseCase();

    const result = await deleteCardUseCase.execute({
      id,
      userId: request.user.id,
    });

    return reply.status(200).send(result);
  }

  async listArchived(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { listId } = listCardsParamsSchema.parse(request.params);

    const listArchivedCardsUseCase = new ListArchivedCardsUseCase();

    const cards = await listArchivedCardsUseCase.execute({
      listId,
      userId: request.user.id,
    });

    return reply.status(200).send({
      cards,
    });
  }
}