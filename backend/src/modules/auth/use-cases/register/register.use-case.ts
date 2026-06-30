import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma.js";
import type { RegisterInput } from "../../schemas/register.schema.js";
import { AppError } from "../../../../shared/errors/app-error.js";

export class RegisterUseCase {
  async execute(data: RegisterInput) {
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userAlreadyExists) {
      throw new AppError("Email já está em uso", 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 8);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return user;
  }
}