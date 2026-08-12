import { z } from "zod";

export const getBoardSchema = z.object({
    id: z.uuid("ID do Board inválido"),
});

export type GetBoardInput = z.infer<
    typeof getBoardSchema
>;