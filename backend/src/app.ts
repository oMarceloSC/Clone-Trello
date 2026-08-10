import Fastify from "fastify";
import cors from "@fastify/cors";

import { prisma } from "./lib/prisma.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { authRoutes } from "./modules/auth/routes/auth.rotes.js";
import { workspaceInvitationRoutes } from "./modules/workspaces/routes/workspace-invitation.routes.js";
import { workspaceRoutes } from "./modules/workspaces/routes/workspace.routes.js";
import { boardRoutes } from "./modules/boards/routes/board.routes.js"

const isProduction = process.env.NODE_ENV === "production";

export const app = Fastify({
  logger: isProduction,
});

app.register(cors, {
  origin: true,
  methods: [
    "GET",
    "HEAD",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],
});

app.register(workspaceRoutes, {
  prefix: "/workspaces",
});

app.register(boardRoutes);

app.register(workspaceInvitationRoutes, {
  prefix: "/workspace-invitations",
});

app.get("/", async () => {
  return {
    status: "online",
    name: "Clone Trello API",
    version: "1.0.0",
  };
});

app.register(authRoutes, {
  prefix: "/auth",
});

app.get("/health/db", async () => {
  const usersCount = await prisma.user.count();

  return {
    status: "database online",
    users: usersCount,
  };
});

app.setErrorHandler(errorMiddleware);