import { User } from "@/database/models/user";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";

export async function makeUser(override: Partial<User>) {
  const user: User = {
    id: randomUUID(),
    email: 'johndoe@example.com',
    name: 'John Doe',
    password: await hash('123456', 6),
    ...override
  }

  return user
}