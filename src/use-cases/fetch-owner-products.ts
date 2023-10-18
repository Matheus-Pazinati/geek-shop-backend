import { Product } from "@/database/models/product"
import { ProductsRepository } from "@/database/repositories/products-repository"

interface FetchOwnerProductsRequest {
  ownerId: string
}

interface FetchOwnerProductsResponse {
  products: Product[]
}

export class FetchOwnerProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    ownerId
  }: FetchOwnerProductsRequest): Promise<FetchOwnerProductsResponse> {
    const ownerProducts = await this.productsRepository.fetchByOwner(ownerId)

    return {
      products: ownerProducts
    }
  }
}