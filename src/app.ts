import express from "express";
import cors from "cors";
import helmet from "helmet";
import { requestLogger } from "./middlewares/requestLogger";
import { errorHandler } from "./middlewares/errorHandler";
import { router } from "./routes";

// 📌 Separar a criação do app do server.ts é uma boa prática:
// - Permite importar o app nos testes sem subir o servidor
// - Deixa o server.ts responsável apenas por "escutar" a porta

export function createApp() {
  const app = express();

  // ── Segurança ─────────────────────────────────────────────
  // helmet: adiciona ~15 headers HTTP de segurança automaticamente
  app.use(helmet());

  // cors: controla quais origens podem chamar a API
  app.use(cors()); // TODO: restringir origens em produção

  // ── Parsing ───────────────────────────────────────────────
  // Habilita leitura de JSON no body das requests
  app.use(express.json());

  // Habilita leitura de form data (application/x-www-form-urlencoded)
  app.use(express.urlencoded({ extended: true }));

  // ── Observabilidade ───────────────────────────────────────
  app.use(requestLogger);

  // ── Rotas ─────────────────────────────────────────────────
  // Prefixo /api para separar da raiz (útil quando serve static files também)
  app.use("/api", router);

  // 404 handler — rota não encontrada
  app.use((_req, res) => {
    res.status(404).json({
      error: {
        message: "Route not found",
        code: "NOT_FOUND",
      },
    });
  });

  // ── Error Handler ─────────────────────────────────────────
  // DEVE ser o último middleware — o Express o identifica pelos 4 parâmetros
  app.use(errorHandler);

  return app;
}
