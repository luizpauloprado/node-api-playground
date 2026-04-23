import { describe, it, expect, vi, beforeEach } from "vitest";
import { productService } from "../product.service";
import { productRepository } from "../product.repository";
import { AppError } from "@/middlewares/errorHandler";
import type { ProductRow } from "@/db/schema/products";

// Mocka o repository inteiro — o service não deve tocar dados reais
vi.mock("../product.repository");

// price é string porque o PostgreSQL retorna numeric como string
const mockProduct: ProductRow = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "Teclado",
  price: "200.00",
  stock: 5,
  description: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("productService.list", () => {
  it("retorna a lista do repository", async () => {
    vi.mocked(productRepository.findAll).mockResolvedValue([mockProduct]);
    expect(await productService.list()).toEqual([mockProduct]);
  });
});

describe("productService.getById", () => {
  it("retorna o produto quando encontrado", async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct);
    expect(await productService.getById(mockProduct.id)).toEqual(mockProduct);
  });

  it("lança AppError 404 quando não encontrado", async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(undefined);
    await expect(productService.getById("qualquer-id")).rejects.toThrow(AppError);
  });

  it("o AppError tem statusCode 404 e code correto", async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(undefined);
    try {
      await productService.getById("qualquer-id");
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(404);
      expect((err as AppError).code).toBe("PRODUCT_NOT_FOUND");
    }
  });
});

describe("productService.create", () => {
  it("repassa o input ao repository e retorna o produto criado", async () => {
    vi.mocked(productRepository.create).mockResolvedValue(mockProduct);
    const input = { name: "Teclado", price: 200, stock: 5 };
    const result = await productService.create(input);
    expect(productRepository.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockProduct);
  });
});

describe("productService.update", () => {
  it("atualiza quando produto existe", async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct);
    const updated = { ...mockProduct, name: "Teclado Pro" };
    vi.mocked(productRepository.update).mockResolvedValue(updated);

    const result = await productService.update(mockProduct.id, { name: "Teclado Pro" });
    expect(result).toEqual(updated);
  });

  it("lança AppError 404 ao atualizar produto inexistente", async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(undefined);
    await expect(
      productService.update("inexistente", { name: "X" })
    ).rejects.toThrow(AppError);
  });
});

describe("productService.delete", () => {
  it("deleta quando produto existe", async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct);
    vi.mocked(productRepository.delete).mockResolvedValue(true);
    await expect(productService.delete(mockProduct.id)).resolves.not.toThrow();
    expect(productRepository.delete).toHaveBeenCalledWith(mockProduct.id);
  });

  it("lança AppError 404 ao deletar produto inexistente", async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(undefined);
    await expect(productService.delete("inexistente")).rejects.toThrow(AppError);
  });
});
