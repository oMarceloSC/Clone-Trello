import type { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";

const authController = new AuthController();

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", authController.register);
  app.post("/login", authController.login);

  app.get("/me", {
    preHandler: authMiddleware,
  }, authController.me);
}