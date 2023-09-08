import { User } from "@/database/models/user";
import { UsersRepository } from "@/database/repositories/users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async findByEmail(email: string) {
    const user = this.users.find((user) => {
      return user.email === email
    })

    if (!user) {
      return null
    }

    return user
  }

  async create(user: User) {
    this.users.push(user)
  }
  
}