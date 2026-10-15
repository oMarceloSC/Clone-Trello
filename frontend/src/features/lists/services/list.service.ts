import { api } from "../../../services/api";

import type {
  BoardList,
  CreateListInput,
  CreateListResponse,
  DeleteListResponse,
  ListListsResponse,
  ReorderListsInput,
  ReorderListsResponse,
  UpdateListInput,
  UpdateListResponse,
} from "../types/list.types";

export const listService = {
    async create(
        boardId: string,
        data: CreateListInput,
    ): Promise<BoardList> {
        const response = await api.post<CreateListResponse>(
            `/boards/${boardId}/lists`,
            data,
        );

        return response.data.list;
    },

    async list(
        boardId: string,
    ): Promise<BoardList[]> {
        const response = await api.get<ListListsResponse>(
            `/boards/${boardId}/lists`,
        );

        return response.data.lists;
    },

    async update(
        listId: string,
        data: UpdateListInput,
    ): Promise<BoardList> {
        const response = await api.patch<UpdateListResponse>(
            `/lists/${listId}`,
            data,
        );

        return response.data.list;
    },

    async delete(
        listId: string,
    ): Promise<void> {
        await api.delete<DeleteListResponse>(
            `/lists/${listId}`,
        );
    },

    async reorder(
        boardId: string,
        data: ReorderListsInput,
    ): Promise<BoardList[]> {
        const response = await api.patch<ReorderListsResponse>(
            `/boards/${boardId}/lists/reorder`,
            data,
        );

        // O controller atual envia somente a mensagem de sucesso.
        return response.data.lists ?? await listService.list(boardId);
    },
};
