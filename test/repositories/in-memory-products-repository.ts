import { Categories, Product } from "@/database/models/product";
import { ProductsRepository } from "@/database/repositories/products-repository";
import { NewProductData } from "@/use-cases/edit-product";
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

  async save(product: NewProductData, productId: string) {
    const productIndex = this.products.findIndex((item) => {
      return item.id === productId
    })

    this.products[productIndex] = {
      id: productId,
      name: product.name ? product.name : this.products[productIndex].name,
      description: product.description ? product.description : this.products[productIndex].description,
      price: product.price ? product.price : this.products[productIndex].price,
      category: product.product_category ? product.product_category : this.products[productIndex].category,
      imageUrl: product.image_url ? product.image_url : this.products[productIndex].imageUrl,
      ownerId: product.owner_id ? product.owner_id : this.products[productIndex].ownerId,
    }
  }

  async fetchByCategory(category: Categories) {
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