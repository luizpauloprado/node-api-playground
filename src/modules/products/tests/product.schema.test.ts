import { describe, it, expect } from "vitest";
import {
  createProductSchema,
  updateProductSchema,
  productParamsSchema,
} from "../product.schema";

describe("createProductSchema", () => {
  it("aceita um produto válido", () => {
    const result = createProductSchema.safeParse({
      name: "Teclado Mecânico",
      price: 349.9,
    });
    expect(result.success).toBe(true);
  });

  it("aplica stock=0 como default", () => {
    const result = createProductSchema.safeParse({ name: "X", price: 1 });
    expect(result.success && result.data.stock).toBe(0);
  });

  it("rejeita name vazio", () => {
    const result = createProductSchema.safeParse({ name: "", price: 10 });
    expect(result.success).toBe(false);
  });

  it("rejeita name com mais de 100 caracteres", () => {
    const result = createProductSchema.safeParse({
      name: "a".repeat(101),
      price: 10,
    });
    expect(result.success).toBe(false);
  });

  it("rejeita price negativo", () => {
    const result = createProductSchema.safeParse({ name: "X", price: -1 });
    expect(result.success).toBe(false);
  });

  it("rejeita price zero", () => {
    const result = createProductSchema.safeParse({ name: "X", price: 0 });
    expect(result.success).toBe(false);
  });

  it("rejeita stock negativo", () => {
    const result = createProductSchema.safeParse({
      name: "X",
      price: 10,
      stock: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejeita stock não-inteiro", () => {
    const result = createProductSchema.safeParse({
      name: "X",
      price: 10,
      stock: 1.5,
    });
    expect(result.success).toBe(false);
  });

  it("rejeita description com mais de 500 caracteres", () => {
    const result = createProductSchema.safeParse({
      name: "X",
      price: 10,
      description: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });
});

describe("updateProductSchema", () => {
  it("aceita objeto vazio (todos os campos são opcionais)", () => {
    const result = updateProductSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("aceita atualização parcial de price", () => {
    const result = updateProductSchema.safeParse({ price: 199 });
    expect(result.success).toBe(true);
  });

  it("rejeita price inválido mesmo sendo parcial", () => {
    const result = updateProductSchema.safeParse({ price: -5 });
    expect(result.success).toBe(false);
  });
});

describe("productParamsSchema", () => {
  it("aceita UUID válido", () => {
    const result = productParamsSchema.safeParse({
      id: "123e4567-e89b-12d3-a456-426614174000",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita string que não é UUID", () => {
    const result = productParamsSchema.safeParse({ id: "nao-e-uuid" });
    expect(result.success).toBe(false);
  });
});
