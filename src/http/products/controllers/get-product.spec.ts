import sql from "@/database/config-db";
import { ProductsPostgresqlRepository } from "@/database/repositories/postgresql/products-postgresql-repository";
import { setupTestSchema, dropTestSchema } from "test/factories/create-db-schema";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { app } from "app";

describe("Get a product E2E Test", () => {
  beforeAll(async () => {
    await setupTestSchema('products')
  })

  afterAll(async() => {
    await dropTestSchema('products')
  })

  test("it should be able to get a product", async () => {
    const productsRepository = new ProductsPostgresqlRepository()
    await productsRepository.create({
      name: "New product",
      category: "starwars",
      description: "Product description",
      imageUrl: "fakeImage.jpeg",
      price: 15
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
})