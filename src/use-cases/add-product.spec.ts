import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { beforeEach, describe, test, expect } from 'vitest'
import { AddProductUseCase } from './add-product'
import { makeProduct } from 'test/factories/make-product'
import { NameAlreadyRegisteredError } from './errors/name-already-registered'

describe('Add Product Test', () => {
  let inMemoryProductsRepository: InMemoryProductsRepository
  let addProduct: AddProductUseCase

  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    addProduct = new AddProductUseCase(inMemoryProductsRepository)
  })

  test('it should be able to add a product', async() => {
    await addProduct.execute({
      name: 'product-example',
      description: 'example of a product',
      category: 'generics',
      imageUrl: 'http://example.com',
      price: 12.99,
      ownerId: "6801dfcc-6aa3-11ee-8c99-0242ac120002"
    })

    expect(inMemoryProductsRepository.products).toHaveLength(1)
    expect(inMemoryProductsRepository.products[0].id).toEqual(
      expect.any(String),
    )
  })

  test('it should not be able to add two products with same name', async() => {
    const firstProduct = await makeProduct({
      name: "same-name"
    })

    inMemoryProductsRepository.create(firstProduct)

    expect(async() => {
      await addProduct.execute({
        name: "same-name",
        description: "same-name-example",
        category: "consoles",
        imageUrl: "http://same-name.png",
        price: 42,
        ownerId: "6801dfcc-6aa3-11ee-8c99-0242ac120002"
      })
    }).rejects.toBeInstanceOf(NameAlreadyRegisteredError)
  })
})
