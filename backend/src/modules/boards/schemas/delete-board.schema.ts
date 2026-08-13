import { z } from "zod";

export const deleteBoardSchema = z.object({
    id: z.uuid("ID do Board inválido"),
});

export type DeleteBoardInput = z.infer<
    typeof deleteBoardSchema
>;