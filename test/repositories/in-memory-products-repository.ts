import { Product } from "@/database/models/product";
import { ProductsRepository } from "@/database/repositories/products-repository";

export class InMemoryProductsRepository implements ProductsRepository {
  public products: Product[] = []

  async findById(id: string) {
    const product = this.products.find((product) => {
      return product.id === id
    })

    if (!product) {
      return null
    }

    return product
  }

  async create(product: Product) {
    this.products.push(product)
  }

  async delete(product: Product) {
    const productToRemoveIndex = this.products.findIndex((item) => {
      return item.id === product.id
    })

    this.products.splice(productToRemoveIndex, 1) 
  }
}