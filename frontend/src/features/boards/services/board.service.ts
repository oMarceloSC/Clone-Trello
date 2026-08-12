import { api } from "../../../services/api";

import type {
  Board,
  CreateBoardRequest,
  CreateBoardResponse,
  GetBoardResponse,
  UpdateBoardRequest,
  UpdateBoardResponse,
} from "../types/board.types";

export async function listBoards(
  workspaceId: string,
): Promise<Board[]> {
  const response =
    await api.get(`/workspaces/${workspaceId}/boards`);

  return response.data.boards;
}

export async function getBoardById(
  boardId: string,
): Promise<Board> {
  const response =
    await api.get<GetBoardResponse>(
      `/boards/${boardId}`,
    );

  return response.data.board;
}

export async function createBoard(
  workspaceId: string,
  data: CreateBoardRequest,
): Promise<CreateBoardResponse> {
  const response =
    await api.post<CreateBoardResponse>(
      `/workspaces/${workspaceId}/boards`,
      data,
    );

  return response.data;
}

export async function updateBoard(
  boardId: string,
  data: UpdateBoardRequest,
): Promise<UpdateBoardResponse> {
  const response =
    await api.patch<UpdateBoardResponse>(
      `/boards/${boardId}`,
      data,
    );

  return response.data;
}