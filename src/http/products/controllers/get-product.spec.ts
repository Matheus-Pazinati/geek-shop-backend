import sql from "@/database/config-db";
import {Request, Response, NextFunction} from "express"
import { setupTestSchema, dropTestSchema } from "test/factories/create-db-schema";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
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

describe("Get a product E2E Test", () => {
  beforeAll(async () => {
    await setupTestSchema('products')
  })

  afterAll(async() => {
    await dropTestSchema('products')
  })

  test("it should be able to get a product", async () => {
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
      name: "New product",
      description: "Lorem ipsum test",
      price: "42",
      category: "starwars"
    })

    const products = await sql`
      SELECT * from Products
    `

    const product = await request(app)
    .get(`/products/${products[0].id}`)
    .send()
    .expect(200)

    expect(product.body).toEqual(
      expect.objectContaining({
        name: "New product"
      })
    )
  })

  test("it should not be able to get a nonexistent product", async() => {
    const nonexistentProductId = "550e8400-e29b-41d4-a716-446655440000"
    await request(app)
    .get(`/products/${nonexistentProductId}`)
    .send()
    .expect(404)
  })
})