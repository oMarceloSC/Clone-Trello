import Fastify from "fastify";
import cors from "@fastify/cors";
import { prisma } from "./lib/prisma.js";
import { authRoutes } from "./modules/auth/auth.rotes.js";

export const app = Fastify({
  logger: true,
});

app.register(cors, {
  origin: true,
});

app.get("/", async () => {
  return {
    status: "online",
    name: "Clone Trello API",
    version: "1.0.0",
  };
});

app.register(authRoutes, { 
  prefix: "/auth" 
});

app.get("/health/db", async () => {
  const usersCount = await prisma.user.count();

  return {
    status: "database online",
    users: usersCount,
  };
});