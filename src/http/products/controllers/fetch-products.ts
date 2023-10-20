import { ProductsPostgresqlRepository } from "@/database/repositories/postgresql/products-postgresql-repository";
import { FetchProductsUseCase } from "@/use-cases/fetch-products";
import { Request, Response } from "express";

export async function fetchProducts(request: Request, response: Response) {
  
  const productsRepository = new ProductsPostgresqlRepository()
  const fetchProductsUseCase = new FetchProductsUseCase(productsRepository)

  const { products } = await fetchProductsUseCase.execute()

  return response.status(200).json(products)
}