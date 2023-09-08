import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { describe, expect, test, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { makeUser } from 'test/factories/make-user'

describe("Create User Test", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository
  let register: RegisterUseCase

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    register = new RegisterUseCase(inMemoryUsersRepository)
  })

  test("it should be able to create a user", async() => {
    await register.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456'
    })

    expect(inMemoryUsersRepository.users).toHaveLength(1)
    expect(inMemoryUsersRepository.users[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "John Doe",
        email: "johndoe@example.com",
        password: expect.any(String)
      })
    )
  })

  test("it should not be able to create a user with email already registered", async() => {
    const user = await makeUser({
      email: "samemail@example.com"
    })

    inMemoryUsersRepository.create(user)

    expect(async() => {
      await register.execute({
        email: 'samemail@example.com',
        name: 'John Doe',
        password: '123456'
      })
    }).rejects.toBeInstanceOf(Error)
  })
})