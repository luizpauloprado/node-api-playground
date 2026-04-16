import "dotenv/config";
import { z } from "zod";

// 📌 Schema de validação das variáveis de ambiente
// Se alguma variável estiver faltando ou errada, a API falha na inicialização
// (fail-fast: melhor crashar no boot do que ter bug em runtime)
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000), // coerce converte string "3000" → number
  APP_NAME: z.string().default("api-starter"),
  APP_VERSION: z.string().default("1.0.0"),
  DATABASE_URL: z.string().url().optional(), // opcional por enquanto (Módulo 3)
});

// Valida as envs no momento em que o módulo é importado
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1); // para a aplicação imediatamente
}

export const env = parsed.data;

// Tipos inferidos automaticamente pelo Zod — sem duplicação!
export type Env = z.infer<typeof envSchema>;
