import Fastify from "fastify";
import cors from "@fastify/cors";

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