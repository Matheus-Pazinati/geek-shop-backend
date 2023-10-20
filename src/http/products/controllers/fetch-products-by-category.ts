import { CATEGORIES } from "@/database/models/product";
import { ProductsPostgresqlRepository } from "@/database/repositories/postgresql/products-postgresql-repository";
import { FetchProductsByCategoryUseCase } from "@/use-cases/fetch-products-by-category";
import { Response, Request } from "express";
import { ZodError, z } from "zod";

export async function fetchProductsByCategory(request: Request, response: Response) {
  const fetchProductsByCategorySchema = z.object({
    category: z.enum(CATEGORIES)
  })

  try {
    const { category } = fetchProductsByCategorySchema.parse(request.params)
    const productsRepository = new ProductsPostgresqlRepository()
    const fetchProductsByCategoryUseCase = new FetchProductsByCategoryUseCase(productsRepository)

    const { products } = await fetchProductsByCategoryUseCase.execute({
      category
    })

    return response.status(200).json(products)

  } catch (error) {
    if (error instanceof ZodError) {
      return response.status(400).send({
        message: error.message
      })
    }
  }
}