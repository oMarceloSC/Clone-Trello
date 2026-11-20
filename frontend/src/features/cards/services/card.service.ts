import { api } from "../../../services/api";

import type {
  CreateCardInput,
  CreateCardResponse,
  GetCardResponse,
  ListCardsResponse,
} from "../types/card.types";

export type UpdateCardInput = {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
};

export type MoveCardInput = {
  targetListId: string;
  position: number;
};

type CardResponse = GetCardResponse;

type DeleteCardResponse = {
  message: string;
};

export const cardService = {
  async list(listId: string, signal?: AbortSignal) {
    const response = await api.get<ListCardsResponse>(
      `/lists/${listId}/cards`,
      { signal },
    );

    return response.data.cards;
  },

  async create(listId: string, data: CreateCardInput) {
    const response = await api.post<CreateCardResponse>(
      `/lists/${listId}/cards`,
      data,
    );

    return response.data.card;
  },

  async get(id: string, signal?: AbortSignal) {
    const response = await api.get<GetCardResponse>(
      `/cards/${id}`,
      { signal },
    );

    return response.data.card;
  },

  async update(id: string, data: UpdateCardInput) {
    const response = await api.patch<CardResponse>(
      `/cards/${id}`,
      data,
    );

    return response.data.card;
  },

  async archive(id: string) {
    const response = await api.patch<CardResponse>(
      `/cards/${id}/archive`,
    );

    return response.data.card;
  },

  async restore(id: string) {
    const response = await api.patch<CardResponse>(
      `/cards/${id}/restore`,
    );

    return response.data.card;
  },

  async move(id: string, data: MoveCardInput) {
    const response = await api.patch<CardResponse>(
      `/cards/${id}/move`,
      data,
    );

    return response.data.card;
  },

  async delete(id: string) {
    const response = await api.delete<DeleteCardResponse>(
      `/cards/${id}`,
    );

    return response.data;
  },

  async listArchived(listId: string, signal?: AbortSignal) {
    const response = await api.get<ListCardsResponse>(
      `/lists/${listId}/cards/archived`,
      { signal },
    );

    return response.data.cards;
  }
};