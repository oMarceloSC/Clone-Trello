import { z } from "zod";

export const favoriteBoardParamsSchema = z.object({
    id: z.uuid("ID do Board inválido"),
});

export const favoriteBoardBodySchema = z.object({
    isFavorite: z.boolean(),
});

export type FavoriteBoardParamsInput = z.infer<
    typeof favoriteBoardParamsSchema
>;

export type FavoriteBoardBodyInput = z.infer<
    typeof favoriteBoardBodySchema
>;