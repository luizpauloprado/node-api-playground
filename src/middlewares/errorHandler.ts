import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger";

// 📌 AppError: classe para erros "esperados" da aplicação
// Diferente de erros inesperados (bugs), estes têm status HTTP e mensagem amigável
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 400,
    public readonly code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

// 📌 Formato padrão de resposta de erro — consistente em toda a API
type ErrorResponse = {
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
};

// 📌 Error handler centralizado — sempre o último middleware do Express
// Captura QUALQUER erro passado via next(err) em qualquer rota
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // Erro de validação do Zod (body/params inválidos)
  if (err instanceof ZodError) {
    res.status(422).json({
      error: {
        message: "Validation error",
        code: "VALIDATION_ERROR",
        details: err.flatten().fieldErrors,
      },
    } satisfies ErrorResponse);
    return;
  }

  // Erro da nossa aplicação (ex: recurso não encontrado, regra de negócio)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
      },
    } satisfies ErrorResponse);
    return;
  }

  // Erro inesperado — loga com detalhes e retorna 500 genérico
  logger.error({ err, path: req.path, method: req.method }, "Unhandled error");
  res.status(500).json({
    error: {
      message: "Internal server error",
      code: "INTERNAL_ERROR",
    },
  } satisfies ErrorResponse);
}
