import { api } from "../../../services/api";

import type {
  Board,
  CreateBoardRequest,
  CreateBoardResponse,
  ListBoardsResponse,
} from "../types/board.types";

export async function listBoards(
  workspaceId: string,
): Promise<Board[]> {
  const response = await api.get<ListBoardsResponse>(
    `/workspaces/${workspaceId}/boards`,
  );

  return response.data.boards;
}

export async function createBoard(
  workspaceId: string,
  data: CreateBoardRequest,
): Promise<CreateBoardResponse> {
  const response = await api.post<CreateBoardResponse>(
    `/workspaces/${workspaceId}/boards`,
    data,
  );

  return response.data;
}