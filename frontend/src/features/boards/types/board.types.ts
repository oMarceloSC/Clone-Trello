export type BoardRole =
    | "OWNER"
    | "ADMIN"
    | "MEMBER"
    | "VIEWER"

export type BoardMember = {
    id: string;
    boardId?: string;
    userId: string;
    role: BoardRole;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
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