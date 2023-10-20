import { setupTestSchema, dropTestSchema } from "test/factories/create-db-schema";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import request from 'supertest'
import { app } from "app";
import { NextFunction, Response, Request } from "express";

function handleImagesUploadMock(request: Request, response: Response, next: NextFunction) {
  response.locals.image = "test.jpeg"
  next()
}

vi.mock('../../middlewares/multer-image-update.ts', () => {
  return {
    handleImagesUploadWithMulter: vi.fn().mockImplementation(handleImagesUploadMock)
  }
})

describe("Fetch all Products E2E Test", () => {
  
  beforeAll(async () => {
    await setupTestSchema('products')
  })

  afterAll(async() => {
    await dropTestSchema('products')
  })

  test("it should be able to fetch all products", async() => {
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
      name: "First product",
      description: "Lorem ipsum test",
      price: "42",
      category: "starwars"
    })
    .expect(201)

    await request(app)
    .post('/products/add')
    .set('Authorization', `Bearer ${token.body}`)
    .send({
      name: "Second product",
      description: "Lorem ipsum test",
      price: "32",
      category: "generics"
    })
    .expect(201)

    const products = await request(app)
    .get('/products/all')
    .send()
    .expect(200)
   
    expect(products.body).toEqual([
      expect.objectContaining({ name: "First product" }),
      expect.objectContaining({ name: "Second product" })
    ])
  })
})