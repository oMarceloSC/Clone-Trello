import { z } from "zod";

export const reorderListsParamsSchema = z.object({
  boardId: z.string().uuid(),
});

export const reorderListsBodySchema = z
  .object({
    listIds: z
      .array(z.string().uuid())
      .refine(
        (ids) => new Set(ids).size === ids.length,
        "A ordem não pode conter IDs duplicados",
      ),
  })
  .strict();

export type ReorderListsInput = z.infer<
  typeof reorderListsBodySchema
>;