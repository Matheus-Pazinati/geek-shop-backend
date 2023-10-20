import { ProductsPostgresqlRepository } from "@/database/repositories/postgresql/products-postgresql-repository";
import { FetchOwnerProductsUseCase } from "@/use-cases/fetch-owner-products";
import { Response } from "express";

export async function fetchOwnerProducts(request: any, response: Response) {
  const productsRepository = new ProductsPostgresqlRepository()
  const fetchOwnerProductsUseCase = new FetchOwnerProductsUseCase(productsRepository)

  const ownerId = await request.user.id

  const { products } = await fetchOwnerProductsUseCase.execute({
    ownerId
  })

  return response.status(200).json(products)
}