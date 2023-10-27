import { Categories, Product } from "@/database/models/product";
import { ProductsRepository } from "../products-repository";
import sql from "@/database/config-db";
import { NewProductData } from "@/use-cases/edit-product";

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
  async fetchAll() {
    const products = await sql<Product[]>`
      SELECT
        *
      FROM Products
    `

    return products
  }
  async fetchByOwner(ownerId: string) {
    const products = await sql<Product[]>`
      SELECT
        *
      FROM Products
        WHERE owner_id = ${ownerId}
    `

    return products
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

  async save(product: any, productId: string) {
    const updatedFields = Object.keys(product)

    await sql`
      UPDATE Products SET ${
        sql(product, updatedFields)
      }
      WHERE id = ${ productId }
    `
  }

  async fetchByCategory(category: Categories) {
    const products = await sql<Product[]>`
      SELECT
        *
      FROM Products
        WHERE product_category = ${ category }
    `

    return products
  }

  async verifyProductOwner(productId: string, ownerId: string) {
    const product: any = await this.findById(productId)
    
    if (product.owner_id == ownerId) {
      return true;
    }

    return false;
  }
}