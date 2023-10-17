import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { beforeEach, describe, expect, test } from "vitest";
import { FetchProductsUseCase } from "./fetch-products";
import { makeProduct } from "test/factories/make-product";

describe("Fetch all Products Unit Test", () => {
  let inMemoryProductsRepository: InMemoryProductsRepository
  let fetchProducts: FetchProductsUseCase

  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    fetchProducts = new FetchProductsUseCase(inMemoryProductsRepository)
  })

  test("it should be able to fetch all products", async() => {
    for(let i = 1; i <= 3; i++) {
      let product = await makeProduct({
        name: `product ${i}`
      })

      inMemoryProductsRepository.create(product)
    }

    const { products } = await fetchProducts.execute()

    expect(products).toHaveLength(3)
    expect(products).toEqual([
      expect.objectContaining({ name: "product 1" }),
      expect.objectContaining({ name: "product 2" }),
      expect.objectContaining({ name: "product 3" })
    ])
  })
})