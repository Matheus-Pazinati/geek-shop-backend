import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { EditProductUseCase } from './edit-product'
import { makeProduct } from 'test/factories/make-product'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

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
      ownerId: product.ownerId
    })

    expect(inMemoryProductsRepository.products[0]).toEqual(
      expect.objectContaining({ name: 'new-name', price: 10 }),
    )
  })

  test('it should not be able to edit a nonexistent product', async () => {
    expect(async() => {
      await editProduct.execute({
        newProductData: {
          id: 'nonexistent-id',
          name: 'nonexistent-name',
          price: 1,
          category: 'generics',
          description: 'fake-description',
          imageUrl: 'fake-url',
          ownerId: '1aea40ac-6f8b-11ee-b962-0242ac120002'
        },
        ownerId: '1aea40ac-6f8b-11ee-b962-0242ac120002'
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  test('it should not be able to edit a product from another user', async() => {
    const productOwnerId = "1fdd3ea6-7207-11ee-b962-0242ac120002"
    const product = await makeProduct({
      ownerId: productOwnerId
    })

    inMemoryProductsRepository.create(product)

    const anotherOwnerId = "b8f35292-7207-11ee-b962-0242ac120002"

    expect(async() => {
      await editProduct.execute({
        newProductData: {
          ...product,
          name: 'new-product'
        },
        ownerId: anotherOwnerId
      })
    }).rejects.toBeInstanceOf(NotAllowedError)
  })
})
