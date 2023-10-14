import { ProductsRepository } from '@/database/repositories/products-repository'
import { UUID, randomUUID } from 'crypto'

interface AddProductUseCaseRequest {
  name: string
  description: string
  price: number
  category: 'starwars' | 'consoles' | 'generics'
  imageUrl: string
  ownerId: UUID
}

export class AddProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    name,
    description,
    category,
    price,
    imageUrl,
    ownerId
  }: AddProductUseCaseRequest) {

    await this.productsRepository.create({
      name,
      description,
      category,
      price,
      imageUrl,
      ownerId
    })
  }
}
