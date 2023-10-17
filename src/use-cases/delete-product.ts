import { ProductsRepository } from '@/database/repositories/products-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UUID } from 'node:crypto'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteProductUseCaseRequest {
  productId: string
  ownerId: UUID
}

export class DeleteProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ productId, ownerId }: DeleteProductUseCaseRequest) {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      throw new ResourceNotFoundError()
    }

    const isOwner = await this.productsRepository.verifyProductOwner(productId, ownerId)

    if (!isOwner) {
      throw new NotAllowedError()
    }

    await this.productsRepository.delete(product)
  }
}
