import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { EditProductUseCase } from './edit-product'
import { makeProduct } from 'test/factories/make-product'

describe('Edit a Product Test', () => {
  let inMemoryProductsRepository: InMemoryProductsRepository
  let editProduct: EditProductUseCase

  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    editProduct = new EditProductUseCase(inMemoryProductsRepository)
  })

  test('it should be able to edit a product', async () => {
    const product = await makeProduct({
      name: 'old-name',
      price: 8,
    })

    inMemoryProductsRepository.create(product)

    await editProduct.execute({
      newProductData: {
        ...product,
        name: 'new-name',
        price: 10,
      },
    })

    expect(inMemoryProductsRepository.products[0]).toEqual(
      expect.objectContaining({ name: 'new-name', price: 10 }),
    )
  })

  test('it should not be able to edit a nonexistent product', async () => {
    expect(async () => {
      await editProduct.execute({
        newProductData: {
          id: 'nonexistent-id',
          name: 'nonexistent-name',
          price: 1,
          category: 'generics',
          description: 'fake-description',
          imageUrl: 'fake-url',
        },
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
