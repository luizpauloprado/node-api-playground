import { AppError } from "../../middlewares/errorHandler";
import { productRepository } from "./product.repository";
import type { CreateProductInput, UpdateProductInput } from "./product.schema";

export const productService = {
  list() {
    return productRepository.findAll();
  },

  getById(id: string) {
    const product = productRepository.findById(id);
    if (!product) throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");
    return product;
  },

  create(input: CreateProductInput) {
    return productRepository.create(input);
  },

  update(id: string, input: UpdateProductInput) {
    // Garante que o produto existe antes de tentar atualizar
    this.getById(id);
    return productRepository.update(id, input)!;
  },

  delete(id: string) {
    // Garante que o produto existe antes de tentar deletar
    this.getById(id);
    productRepository.delete(id);
  },
};
