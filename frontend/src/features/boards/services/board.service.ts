import { api } from "../../../services/api";

import type {
  ArchiveBoardRequest,
  ArchiveBoardResponse,
  Board,
  CreateBoardRequest,
  CreateBoardResponse,
  DeleteBoardResponse,
  FavoriteBoardRequest,
  FavoriteBoardResponse,
  GetBoardResponse,
  ListArchivedBoardsResponse,
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

export async function deleteBoard(
  boardId: string,
): Promise<DeleteBoardResponse> {
  const response = 
    await api.delete<DeleteBoardResponse>(
      `/boards/${boardId}`,
    );

  return response.data;
}

export async function favoriteBoard(
  boardId: string,
  data: FavoriteBoardRequest,
): Promise<FavoriteBoardResponse> {
  const response =
    await api.patch<FavoriteBoardResponse>(
      `/boards/${boardId}/favorite`,
      data,
    );

    return response.data
}

export async function archiveBoard(
  boardId: string,
  data: ArchiveBoardRequest,
): Promise<ArchiveBoardResponse> {
  const response =
    await api.patch<ArchiveBoardResponse>(
      `/boards/${boardId}/archive`,
      data,
    );

    return response.data
}

export async function listArchivedBoards(
  workspaceId: string,
): Promise<Board[]> {
  const response =
    await api.get<ListArchivedBoardsResponse>(
      `/workspaces/${workspaceId}/boards/archived`,
    );

    return response.data.boards;
}