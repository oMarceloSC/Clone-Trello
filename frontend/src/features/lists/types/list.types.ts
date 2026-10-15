export type BoardList = {
    id: string;
    title: string;
    position: number;
    boardId: string;
    createdAt: string;
    updatedAt: string;
};

export type CreateListInput = {
    title: string;
};

export type UpdateListInput = {
    title: string;
};

export type ReorderListsInput = {
    listIds: string[];
};

export type ListListsResponse = {
    lists: BoardList[];
};

export type CreateListResponse = {
    message: string;
    list: BoardList;
};

export type UpdateListResponse = {
    message: string;
    list: BoardList;
};

export type DeleteListResponse = {
    message: string;
};

export type ReorderListsResponse = {
    message: string;
    lists?: BoardList[];
};
