import { ProductsRepository } from '@/database/repositories/products-repository'
import { UUID, randomUUID } from 'crypto'
import { NameAlreadyRegisteredError } from './errors/name-already-registered'

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

    const productNameAlreadyExists = await this.productsRepository.findByName(name)

    if (productNameAlreadyExists) {
      throw new NameAlreadyRegisteredError()
    }

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
