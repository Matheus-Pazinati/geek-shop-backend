import { Product } from "@/database/models/product";
import { randomUUID } from "node:crypto";

export async function makeProduct(override: Partial<Product>) {
  const product: Product = {
    id: randomUUID(),
    name: 'product',
    description: 'product-description',
    category: 'generics',
    imageUrl: 'http://example.com',
    price: 10,
    ...override
  }

  return product
}