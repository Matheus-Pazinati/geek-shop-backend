import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { describe, beforeEach, test, expect } from "vitest";
import { FetchProductsByCategoryUseCase } from "./fetch-products-by-category";
import { makeProduct } from "test/factories/make-product";

describe("Fetch products by category Test", () => {
  let inMemoryProductsRepository: InMemoryProductsRepository
  let fetchProductsByCategory: FetchProductsByCategoryUseCase

  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    fetchProductsByCategory = new FetchProductsByCategoryUseCase(inMemoryProductsRepository)
  })

  test("it should be able to fetch products by category", async() => {
    const firstProduct = await makeProduct({
      name: 'playstation',
      category: 'consoles'
    })

    const secondProduct = await makeProduct({
      name: 'yoda',
      category: 'starwars'
    })

    const thirdProduct = await makeProduct({
      name: 'xbox',
      category: 'consoles'
    })

    inMemoryProductsRepository.products.push(firstProduct, secondProduct, thirdProduct)

    const { products } = await fetchProductsByCategory.execute({
      category: 'consoles'
    })

    expect(products).toHaveLength(2)
    expect(products).toEqual([
      expect.objectContaining({ name: 'playstation' }),
      expect.objectContaining({ name: 'xbox' })
    ])
  })
})