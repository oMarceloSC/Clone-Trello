import { randomUUID } from "node:crypto";

import { prisma } from "../../../../lib/prisma.js";
import type { ForgotPasswordInput } from "../../schemas/forgot-password.schema.js";

const PASSWORD_RESET_EXPIRATION_IN_MILLISECONDS =
  60 * 60 * 1000;

const PASSWORD_RESET_FRONTEND_URL =
  "http://localhost:5173/reset-password";

export class ForgotPasswordUseCase {
  async execute(data: ForgotPasswordInput) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        id: true,
      },
    });

    const message =
      "Se existir uma conta com este email, as instruções de recuperação foram geradas.";

    if (!user) {
      return {
        message,
        resetToken: null,
        resetUrl: null,
      };
    }

    const currentDate = new Date();

    await prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
      data: {
        usedAt: currentDate,
      },
    });

    const token = randomUUID();

    const expiresAt = new Date(
      currentDate.getTime() +
        PASSWORD_RESET_EXPIRATION_IN_MILLISECONDS,
    );

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    const resetUrl =
      `${PASSWORD_RESET_FRONTEND_URL}` +
      `?token=${encodeURIComponent(token)}`;

    return {
      message,
      resetToken: token,
      resetUrl,
    };
  }
}