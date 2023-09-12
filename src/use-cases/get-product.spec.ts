import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { beforeEach, describe, expect, test } from "vitest";
import { GetProductUseCase } from "./get-product";
import { makeProduct } from "test/factories/make-product";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

describe("Get the product Test", () => {
  let inMemoryProductsRepository: InMemoryProductsRepository
  let getProduct: GetProductUseCase

  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    getProduct = new GetProductUseCase(inMemoryProductsRepository)
  })

  test("it should be able to get a product by his id", async() => {
    const newProduct = await makeProduct()

    inMemoryProductsRepository.create(newProduct)

    const { product } = await getProduct.execute({
      id: newProduct.id
    })

    expect(product).toEqual(
      expect.objectContaining({
        name: newProduct.name,
        id: newProduct.id
      })
    )
  })

  test("it should not be able to get a nonexistent product", async() => {
    expect(async() => {
      await getProduct.execute({
        id: 'nonexistent-product'
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})