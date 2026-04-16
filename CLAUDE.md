# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with hot reload (tsx watch)
npm run build      # Compile to dist/ via tsup (CJS + .d.ts)
npm start          # Run built production server
npm run lint       # ESLint on src/**/*.ts
npm run typecheck  # Type-check without emitting
```

No test framework is configured yet.

## Architecture

Express + TypeScript REST API structured around an **app factory pattern**: `createApp()` in `src/app.ts` assembles the middleware pipeline and routes, while `src/server.ts` boots the HTTP server. This separation allows the app to be imported in tests without starting the listener.

**Middleware pipeline order** (in `app.ts`): Helmet → CORS → JSON parser → Morgan → routes → error handler.

**Module structure** under `src/modules/`: each domain feature is self-contained with its own routes file. New modules are registered in `src/routes/index.ts`.

**Error handling**: throw `AppError` (from `src/middlewares/errorHandler.ts`) anywhere in the stack with a status code and machine-readable `code` string. The centralized error handler middleware distinguishes `AppError` instances from Zod validation errors and unhandled exceptions, shaping the JSON response accordingly.

**Environment config**: `src/config/env.ts` uses Zod to validate required env vars on import — the process crashes at startup if any are missing or invalid. Copy `.env.example` to `.env` before running locally.

**Logging**: Pino via `src/config/logger.ts`. JSON in production, colorized via `pino-pretty` in development.

**Path alias**: `@/*` maps to `src/*` (configured in `tsconfig.json`).

## Current Endpoints

- `GET /api/health` — returns status, app name/version, environment, uptime
