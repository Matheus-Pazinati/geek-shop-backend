export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: 'starwars' | 'consoles' | 'generics'
  imageUrl: string
}
