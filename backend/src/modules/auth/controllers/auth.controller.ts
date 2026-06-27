import type { FastifyReply, FastifyRequest } from "fastify";
import { registerSchema } from "../schemas/register.schema.js";
import { loginSchema } from "../schemas/login.schema.js";
import { RegisterUseCase } from "../use-cases/register/register.use-case.js";
import { LoginUseCase } from "../use-cases/login/login.use-case.js";
import { prisma } from "../../../lib/prisma.js";

const registerUseCase = new RegisterUseCase();
const loginUseCase = new LoginUseCase();

export class AuthController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const data = registerSchema.parse(request.body);

    const user = await registerUseCase.execute(data);

    return reply.status(201).send({
      message: "Usuário criado com sucesso",
      user,
    });
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const data = loginSchema.parse(request.body);

    const result = await loginUseCase.execute(data);

    return reply.status(200).send(result);
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
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