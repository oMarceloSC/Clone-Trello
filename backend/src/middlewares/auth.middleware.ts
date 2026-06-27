import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

type JwtPayload = {
  sub: string;
};

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({
      message: "Token não informado",
    });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return reply.status(401).send({
      message: "Token inválido",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    request.user = {
      id: decoded.sub,
    };
  } catch {
    return reply.status(401).send({
      message: "Token inválido ou expirado",
    });
  }
}