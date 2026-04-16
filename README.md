# API Starter — Node.js + Express + TypeScript

---

## Estrutura de pastas

```
src/
├── config/
│   ├── env.ts                      # Valida env vars no boot com Zod — falha rápido se faltar algo
│   └── logger.ts                   # Logger estruturado (Pino) — JSON em prod, colorido em dev
│
├── middlewares/
│   ├── errorHandler.ts             # AppError + handler centralizado — captura todo next(err)
│   └── requestLogger.ts            # Log de cada request HTTP (método, path, status, duração)
│
├── modules/                        # Cada domínio é auto-contido aqui dentro
│   ├── health/
│   │   └── health.routes.ts        # GET /api/health — liveness check para load balancers
│   └── products/
│       ├── product.schema.ts       # Tipos e schemas Zod (CreateProductInput, Product, etc.)
│       ├── product.repository.ts   # Acesso a dados — única camada que toca o banco (in-memory por agora)
│       ├── product.service.ts      # Regras de negócio — não sabe que existe HTTP
│       └── product.routes.ts       # Handlers HTTP — valida input, chama service, responde
│
├── routes/
│   └── index.ts                    # Registry central — registra todos os módulos com seus prefixos
│
├── app.ts                          # Factory do Express — monta o pipeline de middlewares e rotas
└── server.ts                       # Entrypoint — sobe o HTTP server + graceful shutdown
```

---

## Setup

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Rodar em desenvolvimento
npm run dev

# 4. Build para produção
npm run build && npm start
```

---

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/health` | Status da aplicação |
| `GET` | `/api/products` | Lista todos os produtos |
| `GET` | `/api/products/:id` | Busca produto por UUID |
| `POST` | `/api/products` | Cria novo produto |
| `PATCH` | `/api/products/:id` | Atualiza produto parcialmente |
| `DELETE` | `/api/products/:id` | Remove produto |

---

## Conceitos-chave

### Configuração e Boot
| Conceito | Onde | Por quê |
|---|---|---|
| Validação de env com Zod | `config/env.ts` | Fail-fast no boot — processo não sobe com config inválida |
| App factory pattern | `app.ts` vs `server.ts` | Permite importar o app nos testes sem abrir porta |
| Graceful shutdown | `server.ts` | Aguarda requests em andamento antes de fechar — deploys sem downtime |

### Arquitetura de Módulos
| Conceito | Onde | Por quê |
|---|---|---|
| Routes → Service → Repository | `modules/products/` | Cada camada tem uma responsabilidade; trocar o banco não afeta o service |
| Schema centralizado (Zod) | `product.schema.ts` | Tipos e validação derivados da mesma fonte — sem duplicação |
| Repository pattern | `product.repository.ts` | Isola acesso a dados — será substituído pelo Drizzle sem mudar service nem routes |

### HTTP e Erros
| Conceito | Onde | Por quê |
|---|---|---|
| Validação na borda (routes) | `product.routes.ts` | O service recebe dados já tipados e confiáveis |
| AppError pattern | `middlewares/errorHandler.ts` | Erros com status HTTP semântico, lançados de qualquer camada |
| Error handler com 4 parâmetros | `middlewares/errorHandler.ts` | Assinatura obrigatória para o Express reconhecer como error middleware |
| `PATCH` vs `PUT` | `product.routes.ts` | PATCH atualiza campos parcialmente; PUT substituiria o recurso inteiro |

### Observabilidade
| Conceito | Onde | Por quê |
|---|---|---|
| Logger estruturado (JSON) | `config/logger.ts` | Logs pesquisáveis em produção (Datadog, Loki, CloudWatch) |
| Request logging | `middlewares/requestLogger.ts` | Rastreabilidade de cada request sem instrumentar cada rota |
| Health check endpoint | `modules/health/` | Necessário para load balancers e orquestradores (K8s, Railway, Fly.io) |