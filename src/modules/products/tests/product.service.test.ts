import { describe, it, expect, vi, beforeEach } from "vitest";
import { productService } from "../product.service";
import { productRepository } from "../product.repository";
import { AppError } from "@/middlewares/errorHandler";
import type { Product } from "./product.schema";

// Mocka o repository inteiro — o service não deve tocar dados reais
vi.mock("../product.repository");

const mockProduct: Product = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "Teclado",
  price: 200,
  stock: 5,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("productService.list", () => {
  it("retorna a lista do repository", () => {
    vi.mocked(productRepository.findAll).mockReturnValue([mockProduct]);
    expect(productService.list()).toEqual([mockProduct]);
  });
});

describe("productService.getById", () => {
  it("retorna o produto quando encontrado", () => {
    vi.mocked(productRepository.findById).mockReturnValue(mockProduct);
    expect(productService.getById(mockProduct.id)).toEqual(mockProduct);
  });

  it("lança AppError 404 quando não encontrado", () => {
    vi.mocked(productRepository.findById).mockReturnValue(undefined);
    expect(() => productService.getById("qualquer-id")).toThrow(AppError);
  });

  it("o AppError tem statusCode 404 e code correto", () => {
    vi.mocked(productRepository.findById).mockReturnValue(undefined);
    try {
      productService.getById("qualquer-id");
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(404);
      expect((err as AppError).code).toBe("PRODUCT_NOT_FOUND");
    }
  });
});

describe("productService.create", () => {
  it("repassa o input ao repository e retorna o produto criado", () => {
    vi.mocked(productRepository.create).mockReturnValue(mockProduct);
    const input = { name: "Teclado", price: 200, stock: 5 };
    const result = productService.create(input);
    expect(productRepository.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockProduct);
  });
});

describe("productService.update", () => {
  it("atualiza quando produto existe", () => {
    vi.mocked(productRepository.findById).mockReturnValue(mockProduct);
    const updated = { ...mockProduct, name: "Teclado Pro" };
    vi.mocked(productRepository.update).mockReturnValue(updated);

    const result = productService.update(mockProduct.id, { name: "Teclado Pro" });
    expect(result).toEqual(updated);
  });

  it("lança AppError 404 ao atualizar produto inexistente", () => {
    vi.mocked(productRepository.findById).mockReturnValue(undefined);
    expect(() =>
      productService.update("inexistente", { name: "X" })
    ).toThrow(AppError);
  });
});

describe("productService.delete", () => {
  it("deleta quando produto existe", () => {
    vi.mocked(productRepository.findById).mockReturnValue(mockProduct);
    vi.mocked(productRepository.delete).mockReturnValue(true);
    expect(() => productService.delete(mockProduct.id)).not.toThrow();
    expect(productRepository.delete).toHaveBeenCalledWith(mockProduct.id);
  });

  it("lança AppError 404 ao deletar produto inexistente", () => {
    vi.mocked(productRepository.findById).mockReturnValue(undefined);
    expect(() => productService.delete("inexistente")).toThrow(AppError);
  });
});
