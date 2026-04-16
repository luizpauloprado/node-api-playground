import pino from "pino";
import { env } from "./env";

// 📌 Pino é muito mais rápido que console.log ou winston
// Em produção: logs em JSON (fácil de ingerir no Datadog, CloudWatch, etc.)
// Em dev: logs coloridos e legíveis via pino-pretty
export const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  ...(env.NODE_ENV !== "production" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  }),
});
