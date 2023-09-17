import { User } from '@/database/models/user'
import { UsersRepository } from '@/database/repositories/users-repository'
import { hash } from 'bcrypt'
import { EmailAlreadyRegisteredError } from './errors/email-already-registered-error'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email)

    if (user) {
      throw new EmailAlreadyRegisteredError()
    }

    const saltRounds = 6
    const passwordHash = await hash(password, saltRounds)

    const newUser: User = {
      name,
      email,
      password: passwordHash,
    }

    await this.usersRepository.create(newUser)
  }
}
