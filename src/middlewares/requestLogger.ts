import morgan from "morgan";
import { env } from "../config/env";

// 📌 Morgan loga cada request HTTP recebido
// Em dev: formato colorido e legível
// Em prod: JSON compacto para ingestão por ferramentas de observabilidade
export const requestLogger = morgan(
  env.NODE_ENV === "production" ? "combined" : "dev"
);
