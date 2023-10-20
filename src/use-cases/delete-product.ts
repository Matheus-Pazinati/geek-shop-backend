import { ProductsRepository } from '@/database/repositories/products-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UUID } from 'node:crypto'
import { NotAllowedError } from './errors/not-allowed-error'
import { Product } from '@/database/models/product'

interface DeleteProductUseCaseRequest {
  productId: string
  ownerId: string
}

interface DeleteProductUseCaseResponse {
  product: Product
}

export class DeleteProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ productId, ownerId }: DeleteProductUseCaseRequest): Promise<DeleteProductUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      throw new ResourceNotFoundError()
    }

    const isOwner = await this.productsRepository.verifyProductOwner(productId, ownerId)

    if (!isOwner) {
      throw new NotAllowedError()
    }

    await this.productsRepository.delete(product)

    return {
      product
    }
  }
}
