import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import { prisma } from "../../../lib/prisma.js";
import { forgotPasswordSchema } from "../schemas/forgot-password.schema.js";
import { loginSchema } from "../schemas/login.schema.js";
import { registerSchema } from "../schemas/register.schema.js";
import { resetPasswordSchema } from "../schemas/reset-password.schema.js";
import { ForgotPasswordUseCase } from "../use-cases/forgot-password/forgot-password.use-case.js";
import { LoginUseCase } from "../use-cases/login/login.use-case.js";
import { RegisterUseCase } from "../use-cases/register/register.use-case.js";
import { ResetPasswordUseCase } from "../use-cases/reset-password/reset-password.use-case.js";

const registerUseCase = new RegisterUseCase();
const loginUseCase = new LoginUseCase();

const forgotPasswordUseCase =
  new ForgotPasswordUseCase();

const resetPasswordUseCase =
  new ResetPasswordUseCase();

export class AuthController {
  async register(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const data = registerSchema.parse(request.body);

    const user = await registerUseCase.execute(data);

    return reply.status(201).send({
      message: "Usuário criado com sucesso",
      user,
    });
  }

  async login(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const data = loginSchema.parse(request.body);

    const result = await loginUseCase.execute(data);

    return reply.status(200).send(result);
  }

  async forgotPassword(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const data = forgotPasswordSchema.parse(
      request.body,
    );

    const result =
      await forgotPasswordUseCase.execute(data);

    return reply.status(200).send(result);
  }

  async resetPassword(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const data = resetPasswordSchema.parse(
      request.body,
    );

    const result =
      await resetPasswordUseCase.execute(data);

    return reply.status(200).send(result);
  }

  async me(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const user = await prisma.user.findUnique({
      where: {
        id: request.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return reply.send({
      user,
    });
  }
}