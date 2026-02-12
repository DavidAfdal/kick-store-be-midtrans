


import app from "./app.js";
import { CONFIG } from "./config/envirotment.config.js";
import { connectRabbit, closeRabbit } from "./config/rabbitmq.config.js";
import { bootstrapEvents } from "./events/bootstrap.js";


async function bootstrap() {
  try {
    await connectRabbit();

    await bootstrapEvents();

    const server = app.listen(CONFIG.app.port, () => {
      console.log(`🚀 Server running on http://localhost:${CONFIG.app.port}`);
    });

    gracefulShutdown(server);

  } catch (err) {
    console.error("💥 Failed to start app:", err.message);
    process.exit(1);
  }
}

function gracefulShutdown(server) {
  const shutdown = async () => {
    console.log("\n Shutting down application...");

    server.close(async () => {
      console.log("HTTP server closed");

      await closeRabbit();

      console.log("RabbitMQ closed");
      process.exit(0);
    });

    setTimeout(() => {
      console.error("Force shutdown");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

bootstrap();
