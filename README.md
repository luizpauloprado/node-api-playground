# 🚀 API Starter — Node.js + Express + TypeScript

Setup do **Módulo 1** do roadmap de REST APIs.

---

## 📁 Estrutura de pastas

```
src/
├── config/
│   ├── env.ts          # Validação de variáveis de ambiente (Zod)
│   └── logger.ts       # Logger estruturado (Pino)
├── middlewares/
│   ├── errorHandler.ts # Tratamento centralizado de erros + AppError
│   └── requestLogger.ts# Log de requests HTTP (Morgan)
├── modules/
│   └── health/
│       └── health.routes.ts  # GET /api/health
├── routes/
│   └── index.ts        # Registry central de rotas
├── app.ts              # Factory do Express app
└── server.ts           # Entrypoint — boot + graceful shutdown
```

---

## ⚙️ Setup

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Rodar em desenvolvimento
npm run dev

# 4. Build para produção
npm run build

# 5. Rodar build de produção
npm start
```

---

## 🧪 Testar o health check

```bash
curl http://localhost:3000/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "app": "api-starter",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2024-07-29T12:00:00.000Z",
  "uptime": 5
}
```

---

## 🔑 Conceitos-chave deste módulo

| Conceito | Onde | Por quê |
|---|---|---|
| Validação de env com Zod | `config/env.ts` | Fail-fast no boot, tipos automáticos |
| App factory pattern | `app.ts` vs `server.ts` | Permite importar o app nos testes |
| AppError pattern | `middlewares/errorHandler.ts` | Erros com status HTTP semântico |
| Error handler com 4 parâmetros | `middlewares/errorHandler.ts` | Obrigatório para o Express reconhecer |
| Graceful shutdown | `server.ts` | Deploys sem downtime |
| Logger estruturado (JSON) | `config/logger.ts` | Observabilidade em produção |
| Health check endpoint | `modules/health/` | Necessário para load balancers |
