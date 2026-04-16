import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative().default(0),
});

export const updateProductSchema = createProductSchema.partial();

export const productParamsSchema = z.object({
  id: z.string().uuid("Invalid product id"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export type Product = CreateProductInput & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
