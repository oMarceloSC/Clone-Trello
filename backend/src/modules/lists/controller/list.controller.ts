import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import {
  createListBodySchema,
  createListParamsSchema,
} from "../schemas/create-list.schema.js";

import { listListsParamsSchema } from "../schemas/list-lists.schema.js";
import { deleteListParamsSchema } from "../schemas/delete-list.schema.js";
import { 
    reorderListsBodySchema,
    reorderListsParamsSchema,
} from "../schemas/reorder-lists.schema.js";

import {
    updateListBodySchema,
    updateListParamsSchema,
} from "../schemas/update-list.schema.js";

import { CreateListUseCase } from "../use-cases/create-list.use-case.js";
import { ListListsUseCase } from "../use-cases/list-lists.use-case.js";
import { UpdateListUseCase } from "../use-cases/update-list.use-case.js";
import { DeleteListUseCase } from "../use-cases/delete-list.use-case.js";
import { ReorderListsUseCase } from "../use-cases/reorder-lists.use-case.js";

const createListUseCase =
    new CreateListUseCase()

const listListsUseCase =
    new ListListsUseCase();

const updateListUseCase =
    new UpdateListUseCase();

const deleteListUseCase = 
    new DeleteListUseCase();

const reorderListsUseCase =
    new ReorderListsUseCase();

export class ListController {
    async create(
        request: FastifyRequest,
        reply: FastifyReply,
    ) {
        const { boardId } =
            createListParamsSchema.parse(
                request.params,
            );

        const { title } =
            createListBodySchema.parse(
                request.body,
            );

        const list =
            await createListUseCase.execute({
                boardId,
                userId: request.user.id,
                title,
            });

        return reply.status(201).send({
            message: "Lista criada com sucesso",
            list,
        });
    }

    async list(
        request: FastifyRequest,
        reply: FastifyReply,
    ) {
        const { boardId } =
            listListsParamsSchema.parse(
                request.params,
            );

        const lists =
            await listListsUseCase.execute({
                boardId,
                userId: request.user.id,
            });

        return reply.status(200).send({
            lists,
        });
    }

    async update(
        request: FastifyRequest,
        reply: FastifyReply,
    ) {
        const { id } =
            updateListParamsSchema.parse(
                request.params,
            );

        const { title } =
            updateListBodySchema.parse(
                request.body,
            );

        const list =
            await updateListUseCase.execute({
                listId: id,
                userId: request.user.id,
                title,
            });

        return reply.status(200).send({
            message: "Lista atualizada com sucesso",
            list,
        });
    }

    async delete(
        request: FastifyRequest,
        reply: FastifyReply,
    ) {
        const { id } =
            deleteListParamsSchema.parse(
                request.params,
            );

        await deleteListUseCase.execute({
            listId: id,
            userId: request.user.id,
        });

        return reply.status(200).send({
            message: "Lista excluída com sucesso",
        });
    }

    async reorder(
        request: FastifyRequest,
        reply: FastifyReply,
    ) {
        const { boardId } =
            reorderListsParamsSchema.parse(
                request.params,
            );

        const { listIds } =
            reorderListsBodySchema.parse(
                request.body,
            );

        const lists =
            await reorderListsUseCase.execute({
                boardId,
                userId: request.user.id,
                listIds,
            });

        return reply.status(200).send({
            message: "Listas reordenadas com sucesso",
        })
    }
}