import { User } from "@/database/models/user";
import { UsersRepository } from "../users-repository";
import sql from '@/database/config-db'

export class UserPostgresqlRepository implements UsersRepository {
  async findByEmail(email: string) {
    const users = await sql<User[]>`
     SELECT
      *
     FROM Users
     WHERE email = ${ email }
    `

    if (!users.length) {
      return null
    }

    return users[0]
  }
  async create(user: User) {
    await sql`
      INSERT INTO
       Users (name, email, password)
       VALUES (${ user.name }, ${ user.email }, ${ user.password })
    `
  }
  
}