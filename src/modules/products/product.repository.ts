import { eq } from "drizzle-orm";
import { db } from "@/config/db";
import { products } from "@/db/schema/products";
import type { CreateProductInput, UpdateProductInput } from "./product.schema";
import type { ProductRow } from "@/db/schema/products";

export type { ProductRow as Product };

export const productRepository = {
  async findAll(): Promise<ProductRow[]> {
    return db.select().from(products);
  },

  async findById(id: string): Promise<ProductRow | undefined> {
    const rows = await db.select().from(products).where(eq(products.id, id));
    return rows[0];
  },

  async create(input: CreateProductInput): Promise<ProductRow> {
    const rows = await db
      .insert(products)
      .values({ ...input, price: String(input.price) })
      .returning();
    return rows[0];
  },

  async update(id: string, input: UpdateProductInput): Promise<ProductRow | undefined> {
    const values: Partial<typeof products.$inferInsert> = {};
    if (input.name !== undefined) values.name = input.name;
    if (input.description !== undefined) values.description = input.description;
    if (input.price !== undefined) values.price = String(input.price);
    if (input.stock !== undefined) values.stock = input.stock;
    values.updatedAt = new Date();

    const rows = await db
      .update(products)
      .set(values)
      .where(eq(products.id, id))
      .returning();
    return rows[0];
  },

  async delete(id: string): Promise<boolean> {
    const rows = await db.delete(products).where(eq(products.id, id)).returning();
    return rows.length > 0;
  },
};
