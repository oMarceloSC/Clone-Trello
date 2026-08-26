import { z } from "zod";

export const removeBoardMemberParamsSchema =
  z.object({
    id: z.uuid(
      "ID do Board inválido",
    ),
    memberId: z.uuid(
      "ID do membro inválido",
    ),
  });

export type RemoveBoardMemberParamsInput =
  z.infer<
    typeof removeBoardMemberParamsSchema
  >;
