import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { DeleteProductUseCase } from './delete-product'
import { makeProduct } from 'test/factories/make-product'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

describe('Delete a Product Test', () => {
  let inMemoryProductsRepository: InMemoryProductsRepository
  let deleteProduct: DeleteProductUseCase

  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    deleteProduct = new DeleteProductUseCase(inMemoryProductsRepository)
  })

  test('it should be able to delete a product', async () => {
    const product = await makeProduct({
      id: '6801dfcc-6aa3-11ee-8c99-0242ac120002',
      ownerId: 'e164a514-6aaf-11ee-8c99-0242ac120002'
    })

    inMemoryProductsRepository.create(product)

    console.log(inMemoryProductsRepository.products[0])

    await deleteProduct.execute({
      productId: product.id!,
      ownerId: product.ownerId
    })

    expect(inMemoryProductsRepository.products).toHaveLength(0)
  })

  test('it should not be able to delete a nonexistent product', async () => {
    const product = await makeProduct({
      id: '0673779a-6ab0-11ee-8c99-0242ac120002',
      ownerId: '0ac3e6a4-6ab0-11ee-8c99-0242ac120002'
    })

    inMemoryProductsRepository.create(product)

    const nonexistentProductId = "2083c650-6aa4-11ee-8c99-0242ac120002"
    expect(async() => {
      await deleteProduct.execute({
        productId: nonexistentProductId,
        ownerId: product.ownerId
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  test('it should not be able to delete a product from another user', async() => {
    const product = await makeProduct({
      id: '35c68622-6ab0-11ee-8c99-0242ac120002',
      ownerId: '399c6f50-6ab0-11ee-8c99-0242ac120002'
    })

    inMemoryProductsRepository.create(product)

    const nonexistentOwnerId = "43377d7a-6ab0-11ee-8c99-0242ac120002"

    expect(async() => {
      await deleteProduct.execute({
        productId: product.id!,
        ownerId: nonexistentOwnerId
      })
    }).rejects.toBeInstanceOf(NotAllowedError)
  })
})
