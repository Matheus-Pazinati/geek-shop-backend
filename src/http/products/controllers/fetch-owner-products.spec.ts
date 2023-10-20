import { NextFunction, Request, Response } from "express";
import { dropTestSchema, setupTestSchema } from "test/factories/create-db-schema";
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

describe("Fetch all Owner Products Test E2E", async() => {
  beforeAll(async() => {
    await setupTestSchema('products')
  })

  afterAll(async() => {
    await dropTestSchema('products')
  })

  test("it should be able to fetch owner products", async() => {
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

    await request(app)
    .post('/products/add')
    .set('Authorization', `Bearer ${anotherUserToken.body}`)
    .send({
      name: "Another product",
      description: "Lorem ipsum test",
      price: "43",
      category: "consoles"
    })

    const products = await request(app)
    .get('/products/owner-products')
    .set('Authorization', `Bearer ${token.body}`)
    .send()
    .expect(200)

    expect(products.body).toHaveLength(1)
    expect(products.body).toEqual([
      expect.objectContaining({ name: 'New product' })
    ])
  })
})