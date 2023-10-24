import { Categories, Product } from '@/database/models/product'
import { ProductsRepository } from '@/database/repositories/products-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

export interface NewProductData {
  name?: string
  description?: string
  price?: number
  product_category?: Categories
  image_url?: string
  owner_id?: string
}

interface EditProductUseCaseRequest {
  newProductData: NewProductData
  ownerId: string
  productId: string
}

export class EditProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ newProductData, ownerId, productId }: EditProductUseCaseRequest) {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      throw new ResourceNotFoundError()
    }

    const isOwner = await this.productsRepository.verifyProductOwner(productId, ownerId)

    if (!isOwner) {
      throw new NotAllowedError()
    }

    await this.productsRepository.save(newProductData, productId)
  }
}
