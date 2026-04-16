import { randomUUID } from "crypto";
import type { CreateProductInput, UpdateProductInput, Product } from "./product.schema";

// Simula um banco de dados em memória — será substituído pelo Drizzle no Módulo 3
const products = new Map<string, Product>();

export const productRepository = {
  findAll(): Product[] {
    return Array.from(products.values());
  },

  findById(id: string): Product | undefined {
    return products.get(id);
  },

  create(input: CreateProductInput): Product {
    const now = new Date();
    const product: Product = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    products.set(product.id, product);
    return product;
  },

  update(id: string, input: UpdateProductInput): Product | undefined {
    const existing = products.get(id);
    if (!existing) return undefined;

    const updated: Product = { ...existing, ...input, updatedAt: new Date() };
    products.set(id, updated);
    return updated;
  },

  delete(id: string): boolean {
    return products.delete(id);
  },
};
