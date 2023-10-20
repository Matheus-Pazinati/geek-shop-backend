import { NextFunction, Request, Response } from "express";
import { dropTestSchema, setupTestSchema } from "test/factories/create-db-schema";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import request from 'supertest'
import { app } from 'app'

function handleImagesUploadMock(request: Request, response: Response, next: NextFunction) {
  response.locals.image = "test.jpeg"
  next()
}

vi.mock('../../middlewares/multer-image-update.ts', () => {
  return {
    handleImagesUploadWithMulter: vi.fn().mockImplementation(handleImagesUploadMock)
  }
})

describe("Fetch all products from a category Test E2E", () => {
  beforeAll(async() => {
    await setupTestSchema('products')
  })

  afterAll(async() => {
    await dropTestSchema('products')
    vi.restoreAllMocks()
  })

  test("it should be able to fetch products by category", async() => {
    await request(app)
    .post('/users')
    .send({
      name: "John Doe",
      email: "john@example.com",
      password: "12345678",
      passwordConfirm: "12345678"
    })

    const token = await request(app)
    .post('/authentication')
    .send({
      email: "john@example.com",
      password: "12345678"
    })

    await request(app)
    .post('/products/add')
    .set('Authorization', `Bearer ${token.body}`)
    .send({
      name: "Starwars Product",
      description: "Lorem ipsum test",
      price: "42",
      category: "starwars"
    })

    await request(app)
    .post('/products/add')
    .set('Authorization', `Bearer ${token.body}`)
    .send({
      name: "Another Starwars Product",
      description: "Lorem ipsum test",
      price: "42",
      category: "starwars"
    })

    await request(app)
    .post('/products/add')
    .set('Authorization', `Bearer ${token.body}`)
    .send({
      name: "Console Product",
      description: "Lorem ipsum test",
      price: "42",
      category: "consoles"
    })

    const products = await request(app)
    .get('/products/categories/starwars')
    .send()

    expect(products.body).toHaveLength(2)
  })

  test("it should not be able to fetch products with a nonexistent category", async() => {
    const products = await request(app)
    .get('/products/categories/invalid-category')
    .send()
    .expect(400)
  })
})