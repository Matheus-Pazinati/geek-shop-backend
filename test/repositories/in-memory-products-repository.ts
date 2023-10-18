import { Product } from "@/database/models/product";
import { ProductsRepository } from "@/database/repositories/products-repository";
import { randomUUID } from "node:crypto";

export class InMemoryProductsRepository implements ProductsRepository {
  public products: Product[] = []

  async findById(id: string) {
    const product = this.products.find((product) => {
      return product.id == id
    })

    if (!product) {
      return null
    }

    return product
  }

  async fetchAll() {
    return this.products
  }

  async findByName(name: string) {
    const product = this.products.find((product) => {
      return product.name == name
    })

    if (!product) {
      return null
    }

    return product
  }

  async create(product: Product) {
    if (!product.id) {
      this.products.push({
        ...product,
        id: randomUUID()
      })
    } else {
      this.products.push(product)
    }
  }

  async delete(product: Product) {
    const productToRemoveIndex = this.products.findIndex((item) => {
      return item.id === product.id
    })

    this.products.splice(productToRemoveIndex, 1) 
  }

  async save(product: Product) {
    const productIndex = this.products.findIndex((item) => {
      return item.id === product.id
    })

    this.products[productIndex] = product
  }

  async fetchByCategory(category: "starwars" | "consoles" | "generics") {
    const products = this.products.filter((product) => {
      return product.category === category
    })

    return products
  }

  async fetchByOwner(ownerId: string) {
    const products = this.products.filter((product) => {
      return product.ownerId == ownerId
    })

    return products
  }

  async verifyProductOwner(productId: string, ownerId: string) {
    const product = await this.findById(productId)

    if (product?.ownerId == ownerId) {
      return true
    }

    return false
  }
}