import { NewProductData } from '@/use-cases/edit-product'
import { Categories, Product } from '../models/product'

export interface ProductsRepository {
  create(product: Product): Promise<void>
  findById(id: string): Promise<Product | null>
  findByName(name: string): Promise<Product | null>
  delete(product: Product): Promise<void>
  save(product: NewProductData, productId: string): Promise<void>
  fetchByCategory(category: Categories): Promise<Product[]>
  fetchByOwner(ownerId: string): Promise<Product[]>
  fetchAll(): Promise<Product[]>
  verifyProductOwner(productId: string, ownerId: string): Promise<boolean>
}
