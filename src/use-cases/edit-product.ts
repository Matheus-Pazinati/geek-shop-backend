import { Product } from '@/database/models/product'
import { ProductsRepository } from '@/database/repositories/products-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface EditProductUseCaseRequest {
  newProductData: Product
  ownerId: string
}

export class EditProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ newProductData, ownerId }: EditProductUseCaseRequest) {
    const product = await this.productsRepository.findById(newProductData.id!)

    if (!product) {
      throw new ResourceNotFoundError()
    }

    const isOwner = await this.productsRepository.verifyProductOwner(newProductData.id!, ownerId)

    if (!isOwner) {
      throw new NotAllowedError()
    }

    await this.productsRepository.save(newProductData)
  }
}
