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
      category: 'generics',
      description: 'lorem ipsum id',
      imageUrl: "localhost/image.png",
      ownerId: "300def3d-2039-4fde-87e5-7d61a8459e93"
    })

    inMemoryProductsRepository.create(product)

    await editProduct.execute({
      newProductData: {
        name: 'new-name',
        price: 10,
      },
      ownerId: product.ownerId,
      productId: product.id!
    })

    expect(inMemoryProductsRepository.products[0]).toEqual(
      expect.objectContaining(
        { name: 'new-name',
          price: 10 ,
          category: product.category,
          description: product.description,
          imageUrl: product.imageUrl,
          ownerId: product.ownerId
        }
      ),
    )
  })

  test('it should not be able to edit a nonexistent product', async () => {
    expect(async() => {
      await editProduct.execute({
        newProductData: {
          name: 'nonexistent-name',
          price: 1,
          product_category: 'generics',
          description: 'fake-description',
          image_url: 'fake-url',
          owner_id: '1aea40ac-6f8b-11ee-b962-0242ac120002'
        },
        ownerId: '1aea40ac-6f8b-11ee-b962-0242ac120002',
        productId: 'nonexistent-id'
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
          name: 'new-product'
        },
        ownerId: anotherOwnerId,
        productId: product.id!
      })
    }).rejects.toBeInstanceOf(NotAllowedError)
  })
})
