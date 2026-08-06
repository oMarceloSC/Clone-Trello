import type { FastifyInstance } from "fastify";

import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { AuthController } from "../controllers/auth.controller.js";

const authController = new AuthController();

export async function authRoutes(
  app: FastifyInstance,
) {
  app.post(
    "/register",
    authController.register,
  );

  app.post(
    "/login",
    authController.login,
  );

  app.post(
    "/forgot-password",
    authController.forgotPassword,
  );

  app.post(
    "/reset-password",
    authController.resetPassword,
  );

  app.get(
    "/me",
    {
      preHandler: authMiddleware,
    },
    authController.me,
  );
}