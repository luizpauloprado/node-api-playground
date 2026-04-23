import { Router, Request, Response, NextFunction } from "express";
import { productService } from "./product.service";
import {
  createProductSchema,
  updateProductSchema,
  productParamsSchema,
} from "./product.schema";

export const productsRouter = Router();

// GET /products
productsRouter.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await productService.list());
  } catch (err) {
    next(err);
  }
});

// GET /products/:id
productsRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = productParamsSchema.parse(req.params);
    res.json(await productService.getById(id));
  } catch (err) {
    next(err);
  }
});

// POST /products
productsRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createProductSchema.parse(req.body);
    const product = await productService.create(input);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// PATCH /products/:id
productsRouter.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = productParamsSchema.parse(req.params);
    const input = updateProductSchema.parse(req.body);
    res.json(await productService.update(id, input));
  } catch (err) {
    next(err);
  }
});

// DELETE /products/:id
productsRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = productParamsSchema.parse(req.params);
    await productService.delete(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
