import { ProductsRepository } from '@/database/repositories/products-repository'

interface DeleteProductUseCaseRequest {
  productId: string
}

export class DeleteProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ productId }: DeleteProductUseCaseRequest) {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      throw new Error('Product not found.')
    }

    await this.productsRepository.delete(product)
  }
}
