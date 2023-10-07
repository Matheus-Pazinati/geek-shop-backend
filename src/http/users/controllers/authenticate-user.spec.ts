import { dropTestSchema, setupTestSchema } from "test/factories/create-db-schema";
import { afterAll, beforeAll, describe, test } from "vitest";
import request from "supertest"
import { app } from "@/app";

describe("Authenticate User Test E2E", () => {
  beforeAll(async () => {
    await setupTestSchema()
  })

  afterAll(async () => {
    await dropTestSchema()
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

    await request(app)
    .post('/authentication')
    .send({
      email: "matheus@example.com",
      password: "12345678"
    })
    .expect(200)
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