import { ProductsPostgresqlRepository } from "@/database/repositories/postgresql/products-postgresql-repository";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { GetProductUseCase } from "@/use-cases/get-product";
import { Request, Response } from "express";
import { ZodError, z } from "zod";

export async function getProduct(request: Request, response: Response) {
  const getProductSchema = z.object({
    id: z.string().uuid().nonempty({ message: "Mandatory parameter was not sent - id." })
  })

  try {
    const { id } = getProductSchema.parse(request.params)

    const productsRepository = new ProductsPostgresqlRepository()
    const getProductUseCase = new GetProductUseCase(productsRepository)

    const { product } = await getProductUseCase.execute({
      id
    })

    return response.status(200).json(product)

  } catch (error) {
    if (error instanceof ZodError) {
      return response.status(400).send({
        message: error.message
      })
    }

    if (error instanceof ResourceNotFoundError) {
      return response.status(404).send({
        message: error.message
      })
    }
  }
}