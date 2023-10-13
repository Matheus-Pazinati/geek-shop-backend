import { dropTestSchema, setupTestSchema } from "test/factories/create-db-schema";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from "supertest"
import { app } from "app"

describe("Authenticate User Test E2E", () => {
  beforeAll(async () => {
    await setupTestSchema('users')
  })

  afterAll(async () => {
    await dropTestSchema('users')
  })

  test("it should be able to authenticate a user", async() => {
    await request(app)
    .post('/users')
    .send({
      name: "Matheus",
      email: "matheus@example.com",
      password: "12345678",
      passwordConfirm: "12345678"
    })

    const token = await request(app)
    .post('/authentication')
    .send({
      email: "matheus@example.com",
      password: "12345678"
    })
    .expect(200)

    expect(token.text).toEqual(expect.any(String))
  })

  test("it should not be able to authenticate a nonexistent user", async() => {
    await request(app)
    .post('/authentication')
    .send({
      email: "nonexistentuser@example.com",
      password: "12345678"
    })
    .expect(401)
  })
})