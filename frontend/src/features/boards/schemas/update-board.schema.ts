import { z } from "zod";

import { createBoardSchema } from "./create-board.schema";

export const updateBoardSchema = createBoardSchema;

export type UpdateBoardFormData = z.infer<typeof updateBoardSchema>;
