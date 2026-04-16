import { Router, Request, Response, NextFunction } from "express";
import { productService } from "./product.service";
import {
  createProductSchema,
  updateProductSchema,
  productParamsSchema,
} from "./product.schema";

export const productsRouter = Router();

// GET /products
productsRouter.get("/", (_req: Request, res: Response) => {
  res.json(productService.list());
});

// GET /products/:id
productsRouter.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = productParamsSchema.parse(req.params);
    res.json(productService.getById(id));
  } catch (err) {
    next(err);
  }
});

// POST /products
productsRouter.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createProductSchema.parse(req.body);
    const product = productService.create(input);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// PATCH /products/:id
productsRouter.patch("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = productParamsSchema.parse(req.params);
    const input = updateProductSchema.parse(req.body);
    res.json(productService.update(id, input));
  } catch (err) {
    next(err);
  }
});

// DELETE /products/:id
productsRouter.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = productParamsSchema.parse(req.params);
    productService.delete(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
