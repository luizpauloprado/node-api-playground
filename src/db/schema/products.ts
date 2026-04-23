import { pgTable, uuid, varchar, numeric, integer, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id:          uuid("id").defaultRandom().primaryKey(),
  name:        varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),
  price:       numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock:       integer("stock").notNull().default(0),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
  updatedAt:   timestamp("updated_at").defaultNow().notNull(),
});

export type ProductRow = typeof products.$inferSelect;
export type NewProductRow = typeof products.$inferInsert;
