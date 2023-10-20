import { CATEGORIES} from "@/database/models/product";
import { ProductsPostgresqlRepository } from "@/database/repositories/postgresql/products-postgresql-repository";
import { convertRealToCents } from "@/http/utils/convert-real-to-cents";
import { AddProductUseCase } from "@/use-cases/add-product";
import { NameAlreadyRegisteredError } from "@/use-cases/errors/name-already-registered";
import { Response } from "express";
import { ZodError, z } from "zod";

export async function addProduct(request: any, response: Response) {
  const productSchema = z.object({
    name: z.string().nonempty().max(30, { message: "You have exceeded the field's character limit: 30" }),
    description: z.string().nonempty().max(60, { message: "You have exceeded the field's character limit: 60" }),
    price: z.coerce.number().nonnegative(),
    category: z.enum(CATEGORIES)
  })

  try {
    const { name, price, description, category } = productSchema.parse(request.body)

    const priceInCents = convertRealToCents(price)
  
    const imageUrl = await response.locals.image
    
    const productsRepository = new ProductsPostgresqlRepository()
    const createProduct = new AddProductUseCase(productsRepository)

    const ownerId = await request.user.id

    await createProduct.execute({
      name,
      price: priceInCents,
      category,
      description,
      imageUrl,
      ownerId
    })

    return response.status(201).send()

  } catch (error) {
    if (error instanceof ZodError) {
      return response.status(400).send({
        message: error.message
      })
    }
    if (error instanceof NameAlreadyRegisteredError) {
      return response.status(409).send({
        message: error.message
      })
    }
  }
}