import { NextFunction, Request, Response } from "express";
import { afterAll, beforeAll, vi, test } from "vitest";
import { afterEach, describe } from "node:test";
import { setupTestSchema, dropTestSchema } from "test/factories/create-db-schema";
import request from 'supertest'
import { app } from "app";

function handleImagesUploadMock(request: Request, response: Response, next: NextFunction) {
  response.locals.image = "test.jpeg"
  next()
}

vi.mock('../../middlewares/multer-image-update.ts', () => {
  return {
    handleImagesUploadWithMulter: vi.fn().mockImplementation(handleImagesUploadMock)
  }
})

describe("Add Products E2E tests", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  beforeAll(async () => {
    await setupTestSchema('products')
  })

  afterAll(async() => {
    await dropTestSchema('products')
  })

  test("it should be able to create a product", async() => {
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
      name: "Test Product",
      description: "Lorem ipsum test",
      price: "42",
      category: "consoles"
    })
    .expect(201)
  })

  test("it should not be able to create a product without being authenticated", async() => {
    await request(app)
    .post('/products/add')
    .send({
      description: "Lorem ipsum test",
      price: "42",
      category: "consoles"
    })
    .expect(401)
  })

})