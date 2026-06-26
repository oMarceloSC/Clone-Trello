import "dotenv/config";
import { app } from "./app.js";

const port = Number(process.env.PORT) || 3333;

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