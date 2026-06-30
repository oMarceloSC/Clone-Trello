import "dotenv/config";
import { app } from "./app.js";
import { env } from "./config/env.js";

const port = env.PORT;

async function bootstrap() {
  try {
    await app.listen({
      host: "127.0.0.1",
      port,
    });

    console.log("🚀 Clone Trello API iniciada com sucesso!");
    console.log(`📍 URL: http://localhost:${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

bootstrap();