import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { AppError } from "../shared/errors/app-error.js";

export function errorMiddleware(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  console.error("Erro capturado:", error);

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      message: "Erro de validação",
      issues: error.issues,
    });
  }

  return reply.status(500).send({
    statusCode: 500,
    message: "Erro interno do servidor",
  });
}