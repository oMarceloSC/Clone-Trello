import { z } from "zod";

export const listListsParamsSchema = z.object({
    boardId: z.string().uuid(),
});