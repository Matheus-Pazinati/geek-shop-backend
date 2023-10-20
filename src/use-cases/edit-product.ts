import { Product } from '@/database/models/product'
import { ProductsRepository } from '@/database/repositories/products-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditProductUseCaseRequest {
  newProductData: Product
}

export class EditProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ newProductData }: EditProductUseCaseRequest) {
    const product = await this.productsRepository.findById(newProductData.id!)

    if (!product) {
      throw new ResourceNotFoundError()
    }

    await this.productsRepository.save(newProductData)
  }
}
