import { Product } from '../models/product'

export interface ProductsRepository {
  create(product: Product): Promise<void>
  findById(id: string): Promise<Product | null>
  findByName(name: string): Promise<Product | null>
  delete(product: Product): Promise<void>
  save(product: Product): Promise<void>
  fetchByCategory(category: 'starwars' | 'consoles' | 'generics'): Promise<Product[]>
  fetchAll(): Promise<Product[]>
  verifyProductOwner(productId: string, ownerId: string): Promise<boolean>
}
