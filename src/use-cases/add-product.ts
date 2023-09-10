import { ProductsRepository } from "@/database/repositories/products-repository"
import { randomUUID } from "crypto"

interface AddProductUseCaseRequest {
  name: string
  description: string
  price: number
  category: 'starwars' | 'consoles' | 'generics',
  imageUrl: string
}

export class AddProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    name,
    description,
    category,
    price,
    imageUrl
  }: AddProductUseCaseRequest) {
    const productId = randomUUID()

    await this.productsRepository.create({
      id: productId,
      name,
      description,
      category,
      price,
      imageUrl
    })
  }
}