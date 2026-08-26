import { api } from "../../../services/api";

import type {
  AddBoardMemberRequest,
  AddBoardMemberResponse,
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
  ListBoardMembersResponse,
  RemoveBoardMemberResponse,
  UpdateBoardRequest,
  UpdateBoardResponse,
  UpdateBoardMemberRoleRequest,
  UpdateBoardMemberRoleResponse,
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

export async function listBoardMembers(
  boardId: string,
): Promise<Board["members"]> {
  const response =
    await api.get<ListBoardMembersResponse>(
      `/boards/${boardId}/members`,
    );

  return response.data.members;
}

export async function addBoardMember(
  boardId: string,
  data: AddBoardMemberRequest,
): Promise<AddBoardMemberResponse> {
  const response =
    await api.post<AddBoardMemberResponse>(
      `/boards/${boardId}/members`,
      data,
    );

  return response.data;
}

export async function updateBoardMemberRole(
  boardId: string,
  memberId: string,
  data: UpdateBoardMemberRoleRequest,
): Promise<UpdateBoardMemberRoleResponse> {
  const response =
    await api.patch<UpdateBoardMemberRoleResponse>(
      `/boards/${boardId}/members/${memberId}`,
      data,
    );

  return response.data;
}

export async function removeBoardMember(
  boardId: string,
  memberId: string,
): Promise<RemoveBoardMemberResponse> {
  const response =
    await api.delete<RemoveBoardMemberResponse>(
      `/boards/${boardId}/members/${memberId}`,
    );

  return response.data;
}
