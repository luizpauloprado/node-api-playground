import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "@/app";
import { db } from "@/config/db";
import { products } from "@/db/schema/products";

// Testes de integração: usam o app real com PostgreSQL real (Testcontainers).
// Nenhum mock — testamos o ciclo completo HTTP → service → repository → banco → resposta.

const app = createApp();

const validProduct = {
  name: "Monitor 4K",
  description: "144hz, 27 polegadas",
  price: 1800,
  stock: 3,
};

// Limpa a tabela antes de cada teste para garantir isolamento
beforeEach(async () => {
  await db.delete(products);
});

describe("POST /api/products", () => {
  it("cria um produto e retorna 201 com o objeto criado", async () => {
    const res = await request(app).post("/api/products").send(validProduct);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe(validProduct.name);
    expect(res.body.description).toBe(validProduct.description);
    expect(Number(res.body.price)).toBe(validProduct.price); // numeric vira string no PostgreSQL
    expect(res.body.stock).toBe(validProduct.stock);
    expect(res.body.id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  it("retorna 422 quando body é inválido (price negativo)", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({ name: "X", price: -10 });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("retorna 422 quando name está ausente", async () => {
    const res = await request(app).post("/api/products").send({ price: 100 });
    expect(res.status).toBe(422);
  });
});

describe("GET /api/products", () => {
  it("retorna 200 com um array", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /api/products/:id", () => {
  it("retorna o produto quando o id existe", async () => {
    const created = await request(app).post("/api/products").send(validProduct);
    const id = created.body.id;

    const res = await request(app).get(`/api/products/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
  });

  it("retorna 404 quando o id não existe", async () => {
    const res = await request(app).get(
      "/api/products/00000000-0000-0000-0000-000000000000"
    );
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("PRODUCT_NOT_FOUND");
  });

  it("retorna 422 quando o id não é UUID", async () => {
    const res = await request(app).get("/api/products/nao-e-uuid");
    expect(res.status).toBe(422);
  });
});

describe("PATCH /api/products/:id", () => {
  it("atualiza parcialmente e retorna o produto atualizado", async () => {
    const created = await request(app).post("/api/products").send(validProduct);
    const id = created.body.id;

    const res = await request(app)
      .patch(`/api/products/${id}`)
      .send({ price: 999 });

    expect(res.status).toBe(200);
    expect(Number(res.body.price)).toBe(999);
    expect(res.body.name).toBe(validProduct.name);
  });

  it("retorna 404 ao atualizar produto inexistente", async () => {
    const res = await request(app)
      .patch("/api/products/00000000-0000-0000-0000-000000000000")
      .send({ price: 50 });

    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/products/:id", () => {
  it("deleta e retorna 204", async () => {
    const created = await request(app).post("/api/products").send(validProduct);
    const id = created.body.id;

    const res = await request(app).delete(`/api/products/${id}`);
    expect(res.status).toBe(204);
  });

  it("retorna 404 ao deletar produto inexistente", async () => {
    const res = await request(app).delete(
      "/api/products/00000000-0000-0000-0000-000000000000"
    );
    expect(res.status).toBe(404);
  });
});
