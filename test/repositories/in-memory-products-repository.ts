import { Product } from "@/database/models/product";
import { ProductsRepository } from "@/database/repositories/products-repository";

export class InMemoryProductsRepository implements ProductsRepository {
  public products: Product[] = []
  async create(product: Product) {
    this.products.push(product)
  }
}