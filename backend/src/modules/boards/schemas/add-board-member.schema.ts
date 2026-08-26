import { z } from "zod";

export const addBoardMemberParamsSchema =
  z.object({
    id: z.uuid(
      "ID do Board inválido",
    ),
  });

export const addBoardMemberBodySchema =
  z.object({
    memberUserId: z.uuid(
      "ID do usuário inválido",
    ),

    role: z.enum([
      "ADMIN",
      "MEMBER",
      "VIEWER",
    ]),
  });

export type AddBoardMemberParamsInput =
  z.infer<
    typeof addBoardMemberParamsSchema
  >;

export type AddBoardMemberBodyInput =
  z.infer<
    typeof addBoardMemberBodySchema
  >;