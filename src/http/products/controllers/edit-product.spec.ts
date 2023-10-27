import { NextFunction, Request, Response } from "express"
import { dropTestSchema, setupTestSchema } from "test/factories/create-db-schema"
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest"
import request from 'supertest'
import { app } from "app"
import sql from "@/database/config-db"

function handleImagesUploadMock(request: Request, response: Response, next: NextFunction) {
  response.locals.image = "test.jpeg"
  next()
}

vi.mock('../../middlewares/multer-image-update.ts', () => {
  return {
    handleImagesUploadWithMulter: vi.fn().mockImplementation(handleImagesUploadMock)
  }
})

describe("Edit a product Test E2E", () => {
  beforeAll(async() => {
    await setupTestSchema('products')
  })

  afterAll(async() => {
    await dropTestSchema('products')
  })

  test("it should be able to edit a product", async() => {
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

    await request(app)
    .patch(`/products/product/${products[0].id}`)
    .set('Authorization', `Bearer ${token.body}`)
    .send({
      name: "New name",
      price: "43"
    })
    .expect(204)
  })

  test("it should not be able to edit a nonexistent product", async() => {
    const token = await request(app)
    .post('/authentication')
    .send({
      email: "john@example.com",
      password: "12345678"
    })

    const nonExistentProductId = "6209d312-742c-11ee-b962-0242ac120002"

    await request(app)
    .patch(`/products/product/${nonExistentProductId}`)
    .set('Authorization', `Bearer ${token.body}`)
    .send({
      name: "New name",
      price: "43"
    })
    .expect(404)
  })

  test("it should not be able to edit a product from another user", async() => {
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
      name: "Another user",
      description: "Lorem ipsum test",
      price: "42",
      category: "starwars"
    })

    // ANOTHER USER
    await request(app)
    .post('/users')
    .send({
      name: "Pedro Henrique",
      email: "pedro@example.com",
      password: "12345678",
      passwordConfirm: "12345678"
    })
    
    const anotherUserToken = await request(app)
    .post('/authentication')
    .send({
      email: "pedro@example.com",
      password: "12345678"
    })

    const products = await sql`
      SELECT * from Products
    `

    await request(app)
    .patch(`/products/product/${products[0].id}`)
    .set('Authorization', `Bearer ${anotherUserToken.body}`)
    .send({
      name: "Not allowed error",
      price: "45"
    })
    .expect(401)
  })
})