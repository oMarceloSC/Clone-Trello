import type { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../auth.service.js";
import { registerSchema } from "../auth.schemas.js";

const authService = new AuthService();

export class AuthController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const data = registerSchema.parse(request.body);

    const user = await authService.register(data);

    return reply.status(201).send({
      message: "Usuário criado com sucesso",
      user,
    });
  }
}