import { AppError } from "../../middlewares/errorHandler";
import { productRepository } from "./product.repository";
import type { CreateProductInput, UpdateProductInput } from "./product.schema";

export const productService = {
  async list() {
    return productRepository.findAll();
  },

  async getById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");
    return product;
  },

  async create(input: CreateProductInput) {
    return productRepository.create(input);
  },

  async update(id: string, input: UpdateProductInput) {
    await this.getById(id);
    return productRepository.update(id, input) as Promise<NonNullable<Awaited<ReturnType<typeof productRepository.update>>>>;
  },

  async delete(id: string) {
    await this.getById(id);
    await productRepository.delete(id);
  },
};
