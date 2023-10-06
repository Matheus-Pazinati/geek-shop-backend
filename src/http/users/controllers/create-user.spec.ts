import { app } from '@/app'
import request from "supertest"
import { dropTestSchema, setupTestSchema } from 'test/factories/create-db-schema'
import { afterAll, beforeAll, describe, test } from 'vitest'

describe("Create user E2E test", () => {
  beforeAll(async () => {
    await setupTestSchema()
  })

  afterAll(async () => {
    await dropTestSchema()
  })

  test("it should be able to create a user", async() => {
    await request(app)
    .post('/users')
    .send({
      name: "Matheus",
      email: "matheus@examplemail.com",
      password: "12345678",
      passwordConfirm: "12345678"
    })
    .expect(201)
  })
})