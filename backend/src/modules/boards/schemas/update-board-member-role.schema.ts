import { z } from "zod";

export const updateBoardMemberRoleParamsSchema =
    z.object({
        id: z.uuid(
            "ID do Board inválido",
        ),

        memberId: z.uuid(
            "ID do membro inválido",
        ),
    });

export const updateBoardMemberRoleBodySchema =
    z.object({
        role: z.enum([
            "ADMIN",
            "MEMBER",
            "VIEWER",
        ]),
    });

export type UpdateBoardMemberRoleParamsInput =
    z.infer<
        typeof updateBoardMemberRoleParamsSchema
    >;

export type UpdateBoardMemberRoleBodyInput =
    z.infer<
        typeof updateBoardMemberRoleBodySchema
    >;