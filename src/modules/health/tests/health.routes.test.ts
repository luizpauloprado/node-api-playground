import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "@/app";

const app = createApp();

describe("GET /api/health", () => {
  it("retorna 200 com status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("retorna os campos esperados", async () => {
    const res = await request(app).get("/api/health");
    expect(res.body).toMatchObject({
      status: "ok",
      app: expect.any(String),
      version: expect.any(String),
      environment: expect.any(String),
      timestamp: expect.any(String),
      uptime: expect.any(Number),
    });
  });

  it("retorna timestamp no formato ISO 8601", async () => {
    const res = await request(app).get("/api/health");
    expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
  });

  it("retorna uptime maior ou igual a zero", async () => {
    const res = await request(app).get("/api/health");
    expect(res.body.uptime).toBeGreaterThanOrEqual(0);
  });
});