import { UUID } from "node:crypto"

export interface Product {
  id?: UUID
  name: string
  description: string
  price: number
  category: 'starwars' | 'consoles' | 'generics'
  imageUrl: string
  ownerId: UUID
}
