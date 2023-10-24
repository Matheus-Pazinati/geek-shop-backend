export const CATEGORIES = ["starwars", "consoles", "generics"] as const;

export type Categories = "starwars" | "consoles" | "generics"

export interface Product {
  id?: string
  name: string
  description: string
  price: number
  category: Categories
  imageUrl: string
  ownerId: string
}
