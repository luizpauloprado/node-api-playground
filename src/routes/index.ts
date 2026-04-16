import { Router } from "express";
import { healthRouter } from "../modules/health/health.routes";
import { productsRouter } from "../modules/products/product.routes";

// 📌 Router central — ponto único de registro de todas as rotas
// Cada módulo registra suas próprias rotas aqui com seu prefixo
// Facilita versioning: trocar "/health" por "/v1/health" em um lugar só
export const router = Router();

router.use("/health", healthRouter);
router.use("/products", productsRouter);
