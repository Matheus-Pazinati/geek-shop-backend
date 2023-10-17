import { Product } from "@/database/models/product";
import { ProductsRepository } from "@/database/repositories/products-repository";

interface FetchProductsUseCaseResponse {
  products: Product[]
}

export class FetchProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute(): Promise<FetchProductsUseCaseResponse> {
    const products = await this.productsRepository.fetchAll()

    return {
      products
    }
  }
}