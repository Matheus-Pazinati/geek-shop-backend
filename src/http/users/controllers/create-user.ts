import { UserPostgresqlRepository } from "@/database/repositories/postgresql/user-postgresql-repository";
import { EmailAlreadyRegisteredError } from "@/use-cases/errors/email-already-registered-error";
import { RegisterUseCase } from "@/use-cases/register";
import { Request, Response } from "express";
import { ZodError, z } from 'zod'

export async function createUser(request: Request, response: Response) {
  const userRequestSchema = z.object({
    name: z.string().nonempty().max(40),
    email: z.string().email().nonempty().max(50),
    password: z.string().min(8, { message: "The password must be at least 8 characters" }).nonempty(),
    passwordConfirm: z.string().min(8).nonempty()
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["confirm"]
  })

  try {
    const { name, email, password } = userRequestSchema.parse(request.body)
    const usersRepository = new UserPostgresqlRepository()

    const registerUseCase = new RegisterUseCase(usersRepository)
    await registerUseCase.execute({
      email,
      name,
      password
    })
    return response.status(201).send()
  } catch (error) {
    if (error instanceof ZodError) {
      return response.status(400).send({
        message: error.message
      })
    }
    if (error instanceof EmailAlreadyRegisteredError) {
      return response.status(409).send({
        message: error.message,
        path: 'email'
      })
    }
  }
}