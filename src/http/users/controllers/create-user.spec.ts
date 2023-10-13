import { app } from 'app'
import request from "supertest"
import { dropTestSchema, setupTestSchema } from 'test/factories/create-db-schema'
import { afterAll, beforeAll, describe, test } from 'vitest'

describe("Create user E2E test", () => {
  beforeAll(async () => {
    await setupTestSchema('users')
  })

  afterAll(async () => {
    await dropTestSchema('users')
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

  test("it should not be able to create users with same e-mail", async() => {
    await request(app)
    .post('/users')
    .send({
      name: "Pedro",
      email: "pedro@example.com",
      password: "12345678",
      passwordConfirm: "12345678"
    })

    await request(app)
    .post('/users')
    .send({
      name: "Pedro",
      email: "pedro@example.com",
      password: "12345678",
      passwordConfirm: "12345678"
    })
    .expect(409)
  })

  test("it should not be able to create user with wrong password confirm", async() => {
    await request(app)
    .post('/users')
    .send({
      name: "Pedro",
      email: "pedro@email.com",
      password: "12345678",
      passwordConfirm: "123456789"
    })
    .expect(400)
  })
})