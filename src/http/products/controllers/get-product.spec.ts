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
      price: 15,
      ownerId: "de728adb-624a-4d10-b4b7-cd37ef4efc1d"
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