import { Product } from "../models/product";

export interface ProductsRepository {
  create(product: Product): Promise<void>
  findById(id: string): Promise<Product | null>
  delete(product: Product): Promise<void>
}