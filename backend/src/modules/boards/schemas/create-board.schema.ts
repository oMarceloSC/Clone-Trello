import { z } from "zod";

export const createBoardSchema = z.object({
    title: z
        .string()
        .min(3, "Título deve ter pelo menos 3 caracteres"),

    description: z.string().optional(),
    
    backgroundColor: z.string().optional(),
    
    coverImage: z.string().optional(), 
});

export const createBoardParamsSchema = z.object({
    workspaceId: z.uuid(),
});

export type CreateBoardInput = z.infer<
    typeof createBoardSchema
>;

export type CreateBoardParamsInput = z.infer<
    typeof createBoardParamsSchema
>;