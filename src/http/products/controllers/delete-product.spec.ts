import { NextFunction, Request, Response } from "express";
import { dropTestSchema, setupTestSchema } from "test/factories/create-db-schema";
import { afterAll, beforeAll, describe, vi, test } from "vitest";
import request from 'supertest'
import { app } from "app";
import sql from "@/database/config-db";

function handleImagesUploadMock(request: Request, response: Response, next: NextFunction) {
  response.locals.image = "test.jpeg"
  next()
}

vi.mock('../../middlewares/multer-image-update.ts', () => {
  return {
    handleImagesUploadWithMulter: vi.fn().mockImplementation(handleImagesUploadMock)
  }
})

describe("Delete a product E2E Test", () => {
  beforeAll(async() => {
    await setupTestSchema('products')
  })

  afterAll(async() => {
    await dropTestSchema('products')
    vi.restoreAllMocks()
  })

  test("it should be able to delete a product", async() => {
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
    .delete(`/products/${products[0].id}`)
    .set('Authorization', `Bearer ${token.body}`)
    .send()
    .expect(200)
  })

  test("it should not be able to delete a nonexistent product", async() => {
    const token = await request(app)
    .post('/authentication')
    .send({
      email: "john@example.com",
      password: "12345678"
    })

    await request(app)
    .delete("/products/21fdebb2-6ede-11ee-b962-0242ac120002")
    .set('Authorization', `Bearer ${token.body}`)
    .send()
    .expect(404)
  })

  test("it should not be able to delete a product from another user", async() => {
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
      name: "Another product",
      description: "Lorem ipsum test",
      price: "42",
      category: "consoles"
    })

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
    .delete(`/products/${products[0].id}`)
    .set('Authorization', `Bearer ${anotherUserToken.body}`)
    .send()
    .expect(401)
  })
})