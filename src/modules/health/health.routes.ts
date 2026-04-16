import { Router, Request, Response } from "express";
import { env } from "../../config/env";

// 📌 Health check é um padrão essencial para produção
// Load balancers e orquestradores (K8s, Railway, Fly.io) usam esse endpoint
// para saber se a instância está viva e pronta para receber tráfego

export const healthRouter = Router();

// GET /health — liveness check (a instância está de pé?)
healthRouter.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    app: env.APP_NAME,
    version: env.APP_VERSION,
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()), // segundos rodando
  });
});
