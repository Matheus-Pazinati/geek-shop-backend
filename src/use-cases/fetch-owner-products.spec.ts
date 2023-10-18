import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { describe, expect, test, beforeEach } from "vitest";
import { FetchOwnerProductsUseCase } from "./fetch-owner-products";
import { makeProduct } from "test/factories/make-product";

describe("Fetch all products from a Owner", () => {
  let inMemoryProductsRepository: InMemoryProductsRepository
  let fetchOwnerProducts: FetchOwnerProductsUseCase

  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    fetchOwnerProducts = new FetchOwnerProductsUseCase(inMemoryProductsRepository)
  })

  test("it should be able to fetch owner products", async() => {
    const ownerId = "6801dfcc-6aa3-11ee-8c99-0242ac120002"
    const firstProduct = await makeProduct({
      name: "First product",
      ownerId
    })

    const secondProduct = await makeProduct({
      name: "Second product",
      ownerId
    })

    const productFromAnotherUser = await makeProduct({
      ownerId: "0b5b97fa-6d4a-11ee-b962-0242ac120002"
    })

    inMemoryProductsRepository.create(firstProduct)
    inMemoryProductsRepository.create(secondProduct)
    inMemoryProductsRepository.create(productFromAnotherUser)

    const { products } = await fetchOwnerProducts.execute({
      ownerId
    })

    expect(products).toHaveLength(2)
    expect(products).toEqual([
      expect.objectContaining({ name: "First product" }),
      expect.objectContaining({ name: "Second product" })
    ])
  })
})