import { UserPostgresqlRepository } from "@/database/repositories/postgresql/user-postgresql-repository";
import { generateAcessToken } from "@/http/utils/generate-token";
import { Request, Response } from "express";
import { AuthenticationUseCase } from "@/use-cases/authentication";
import { ZodError, z } from "zod";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";

export async function authenticateUser(request: Request, response: Response) {
  const authenticateUserSchema = z.object({
    email: z.string().email().nonempty(),
    password: z.string().nonempty()
  })

  try {
    const { email, password } = authenticateUserSchema.parse(request.body)
    const usersRepository = new UserPostgresqlRepository()

    const authenticationUseCase = new AuthenticationUseCase(usersRepository)

    const { user } = await authenticationUseCase.execute({
      email,
      password
    })
    const { id, name } = user;

    if (id) {
      const accessToken = generateAcessToken({ id, name })
      return response.status(200).send(accessToken)
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return response.status(400).send({
        message: error.message
      })
    }

    if (error instanceof InvalidCredentialsError) {
      return response.status(401).send({
        message: error.message
      })
    }
  }
}