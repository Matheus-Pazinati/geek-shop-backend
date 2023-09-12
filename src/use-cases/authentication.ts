import { User } from '@/database/models/user'
import { UsersRepository } from '@/database/repositories/users-repository'
import { compare } from 'bcrypt'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface AuthenticationUseCaseRequest {
  email: string
  password: string
}

interface AuthenticationUseCaseResponse {
  user: User
}

export class AuthenticationUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticationUseCaseRequest): Promise<AuthenticationUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}
