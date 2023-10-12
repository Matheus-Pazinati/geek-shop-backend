import { Product } from "@/database/models/product";
import { ProductsRepository } from "../products-repository";
import sql from "@/database/config-db";

export class ProductsPostgresqlRepository implements ProductsRepository {
  async create(product: Product) {
    await sql`
      INSERT INTO
       Products (name, description, price, product_category, image_url)
       VALUES (${ product.name }, ${ product.description }, ${product.price}, ${ product.category }, ${ product.imageUrl })
    `
  }
  findById(id: string): Promise<Product | null> {
    throw new Error("Method not implemented.");
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
}