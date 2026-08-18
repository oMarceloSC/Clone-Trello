export type BoardRole =
    | "OWNER"
    | "ADMIN"
    | "MEMBER"
    | "VIEWER"

export type BoardMemberUser = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
};

export type BoardMember = {
    id: string;
    boardId?: string;
    userId: string;
    role: BoardRole;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
    user?: BoardMemberUser;
};

export type Board = {
    id: string;
    title: string;
    description: string | null;
    backgroundColor: string | null;
    coverImage: string | null;
    isArchived: boolean;
    workspaceId: string;
    createdAt: string;
    createdById: string;
    updatedAt: string;
    members: BoardMember[];
    workspace?: {
        id: string;
        name: string;
    };
};

export type ListBoardsResponse = {
    boards: Board[];
};

export type CreateBoardRequest = {
    title: string;
    description?: string;
    backgroundColor?: string;
    coverImage?: string;
};

export type CreateBoardResponse = {
    message: string;
    board: Board;
};

export type GetBoardResponse = {
  board: Board;
};

export type UpdateBoardRequest = {
  title?: string;
  description?: string;
  backgroundColor?: string;
  coverImage?: string;
};

export type UpdateBoardResponse = {
  message: string;
  board: Board;
};

export type DeleteBoardResponse = {
    message: string;
};

export type FavoriteBoardRequest = {
    isFavorite: boolean;
};

export type FavoriteBoardResponse = {
    message: string;
    member: BoardMember;
};

