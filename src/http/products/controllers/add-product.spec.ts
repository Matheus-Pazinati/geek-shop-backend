import { NextFunction, Request, Response } from "express";
import { afterAll, beforeAll, vi, test } from "vitest";
import { afterEach, describe } from "node:test";
import { dropTestSchema, setupTestSchema } from "test/factories/create-db-schema";
import request from 'supertest'
import { app } from "app";

function handleImagesUploadMock(request: Request, response: Response, next: NextFunction) {
  response.locals.image = "test.jpeg"
  next()
}

function validateJWTMock(request: Request, response: Response, next: NextFunction) {
  next()
}

vi.mock('../../middlewares/multer-image-update.ts', () => {
  return {
    handleImagesUploadWithMulter: vi.fn().mockImplementation(handleImagesUploadMock)
  }
})

vi.mock('../../middlewares/validate-jwt.ts', () => {
  return {
    validateJWT: vi.fn().mockImplementation(validateJWTMock)
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
    .post('/products/add')
    .send({
      name: "Test Product",
      description: "Lorem ipsum test",
      price: "42",
      category: "consoles"
    })
    .expect(201)
  })

})