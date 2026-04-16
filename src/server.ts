import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 ${env.APP_NAME} running on port ${env.PORT} [${env.NODE_ENV}]`);
  logger.info(`📍 Health check: http://localhost:${env.PORT}/api/health`);
});

// 📌 Graceful shutdown: espera requests em andamento terminarem antes de fechar
// Essencial para deploys sem downtime (rolling updates, zero-downtime deploys)
const shutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info("Server closed. Bye! 👋");
    process.exit(0);
  });

  // Se demorar mais de 10s, força o encerramento
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10_000);
};

process.on("SIGTERM", () => shutdown("SIGTERM")); // sinal do sistema (Docker, K8s)
process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C no terminal
