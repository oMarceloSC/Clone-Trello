import type { FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller.js";

const authController = new AuthController();

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", authController.register);
}