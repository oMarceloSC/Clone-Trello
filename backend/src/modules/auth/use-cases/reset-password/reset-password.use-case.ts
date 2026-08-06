import bcrypt from "bcryptjs";

import { prisma } from "../../../../lib/prisma.js";
import { AppError } from "../../../../shared/errors/app-error.js";
import type { ResetPasswordInput } from "../../schemas/reset-password.schema.js";

export class ResetPasswordUseCase {
  async execute(data: ResetPasswordInput) {
    const passwordResetToken =
      await prisma.passwordResetToken.findUnique({
        where: {
          token: data.token,
        },
        select: {
          id: true,
          userId: true,
          expiresAt: true,
          usedAt: true,
        },
      });

    if (!passwordResetToken) {
      throw new AppError(
        "Token de recuperação inválido ou expirado",
        400,
      );
    }

    if (passwordResetToken.usedAt) {
      throw new AppError(
        "Este token de recuperação já foi utilizado",
        400,
      );
    }

    const currentDate = new Date();

    if (passwordResetToken.expiresAt <= currentDate) {
      await prisma.passwordResetToken.update({
        where: {
          id: passwordResetToken.id,
        },
        data: {
          usedAt: currentDate,
        },
      });

      throw new AppError(
        "Token de recuperação inválido ou expirado",
        400,
      );
    }

    const passwordHash = await bcrypt.hash(
      data.password,
      8,
    );

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: passwordResetToken.userId,
        },
        data: {
          passwordHash,
        },
      }),

      prisma.passwordResetToken.update({
        where: {
          id: passwordResetToken.id,
        },
        data: {
          usedAt: currentDate,
        },
      }),

      prisma.passwordResetToken.updateMany({
        where: {
          userId: passwordResetToken.userId,
          id: {
            not: passwordResetToken.id,
          },
          usedAt: null,
        },
        data: {
          usedAt: currentDate,
        },
      }),
    ]);

    return {
      message: "Senha redefinida com sucesso",
    };
  }
}