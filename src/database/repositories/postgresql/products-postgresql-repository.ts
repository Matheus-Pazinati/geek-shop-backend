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
  async findByName(name: string) {
    const products = await sql<Product[]>`
      SELECT
        *
      FROM Products
      WHERE NAME = ${ name }
    `

    if (!products.length) {
      return null
    }

    return products[0]
  }
  async delete(product: Product) {
    await sql`
      DELETE FROM 
        Products
          WHERE id = ${ product.id! }
    `
  }
  save(product: Product): Promise<void> {
    throw new Error("Method not implemented.");
  }
  fetchByCategory(category: "starwars" | "consoles" | "generics"): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }
  async verifyProductOwner(productId: UUID, ownerId: UUID) {
    const product: any = await this.findById(productId)
    
    if (product.owner_id == ownerId) {
      return true;
    }

    return false;
  }
}