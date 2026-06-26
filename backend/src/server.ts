import "dotenv/config";
import { app } from "./app.js";

const port = Number(process.env.PORT) || 3333;

app.listen({
  port,
  host: "0.0.0.0",
}).then(() => {
  console.log(`HTTP server running on http://localhost:${port}`);
});