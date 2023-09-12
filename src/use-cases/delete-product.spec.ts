import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { DeleteProductUseCase } from './delete-product'
import { makeProduct } from 'test/factories/make-product'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

describe('Delete a Product Test', () => {
  let inMemoryProductsRepository: InMemoryProductsRepository
  let deleteProduct: DeleteProductUseCase

  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    deleteProduct = new DeleteProductUseCase(inMemoryProductsRepository)
  })

  test('it should be able to delete a product', async () => {
    const product = await makeProduct({
      id: 'product-id',
    })

    inMemoryProductsRepository.create(product)

    await deleteProduct.execute({
      productId: product.id,
    })

    expect(inMemoryProductsRepository.products).toHaveLength(0)
  })

  test('it should not be able to delete a nonexistent product', async () => {
    expect(async () => {
      await deleteProduct.execute({
        productId: 'nonexistent-product-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
