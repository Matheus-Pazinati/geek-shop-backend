import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { AuthenticationUseCase } from './authentication'
import { makeUser } from 'test/factories/make-user'
import { hash } from 'bcrypt'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('User Authentication Test', () => {
  let inMemoryUsersRepository: InMemoryUsersRepository
  let authentication: AuthenticationUseCase

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authentication = new AuthenticationUseCase(inMemoryUsersRepository)
  })

  test('it should be able to authenticate user', async () => {
    const saltRounds = 6
    inMemoryUsersRepository.create(
      await makeUser({
        email: 'user@example.com',
        password: await hash('123456', saltRounds),
      }),
    )

    const { user } = await authentication.execute({
      email: 'user@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  test('it should not be able to authenticate a user with wrong email', async () => {
    const saltRounds = 6
    inMemoryUsersRepository.create(
      await makeUser({
        email: 'user@example.com',
        password: await hash('123456', saltRounds),
      }),
    )

    expect(async () => {
      await authentication.execute({
        email: 'wrongemail@example.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  test('it should not be able to authenticate a user with wrong password', async () => {
    const saltRounds = 6
    inMemoryUsersRepository.create(
      await makeUser({
        email: 'user@example.com',
        password: await hash('123456', saltRounds),
      }),
    )

    expect(async () => {
      await authentication.execute({
        email: 'user@example.com',
        password: 'wrongpassword',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
