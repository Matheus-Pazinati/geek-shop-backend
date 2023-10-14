import { Product } from "@/database/models/product";
import { ProductsRepository } from "../products-repository";
import sql from "@/database/config-db";
import { UUID } from "crypto";

export class ProductsPostgresqlRepository implements ProductsRepository {
  async create(product: Product) {
    await sql`
      INSERT INTO
       Products (name, description, price, product_category, image_url, owner_id)
       VALUES (${ product.name }, ${ product.description }, ${product.price}, ${ product.category }, ${ product.imageUrl }, ${ product.ownerId })
    `
  }
  async findById(id: string) {
    const products = await sql<Product[]>`
      SELECT 
        *
      FROM Products
      WHERE id = ${ id }
    `

    if (!products.length) {
      return null
    }

    return products[0]
  }
  delete(product: Product): Promise<void> {
    throw new Error("Method not implemented.");
  }
  save(product: Product): Promise<void> {
    throw new Error("Method not implemented.");
  }
  fetchByCategory(category: "starwars" | "consoles" | "generics"): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }
  verifyProductOwner(productId: UUID, ownerId: UUID): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}