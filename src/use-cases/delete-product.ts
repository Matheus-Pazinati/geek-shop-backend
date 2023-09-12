import { ProductsRepository } from '@/database/repositories/products-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteProductUseCaseRequest {
  productId: string
}

export class DeleteProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ productId }: DeleteProductUseCaseRequest) {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      throw new ResourceNotFoundError()
    }

    await this.productsRepository.delete(product)
  }
}
