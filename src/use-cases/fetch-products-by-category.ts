import { Product } from "@/database/models/product";
import { ProductsRepository } from "@/database/repositories/products-repository";

interface FetchProductsByCategoryUseCaseRequest {
  category: 'starwars' | 'consoles' | 'generics'
}

interface FetchProductsByCategoryUseCaseResponse {
  products: Product[]
}

export class FetchProductsByCategoryUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    category
  }: FetchProductsByCategoryUseCaseRequest): Promise<FetchProductsByCategoryUseCaseResponse> {
    const products = await this.productsRepository.fetchByCategory(category)

    return {
      products
    }
  }
}