import { ProductsPostgresqlRepository } from "@/database/repositories/postgresql/products-postgresql-repository";
import { AddProductUseCase } from "@/use-cases/add-product";
import { Request, Response } from "express";
import { ZodError, z } from "zod";

export async function addProduct(request: Request, response: Response) {
  const productSchema = z.object({
    name: z.string().nonempty().max(30, { message: "You have exceeded the field's character limit: 30" }),
    description: z.string().nonempty().max(60, { message: "You have exceeded the field's character limit: 60" }),
    price: z.coerce.number().nonnegative(),
    category: z.enum(["starwars", "consoles", "generics"]),
  })

  const isFileAImage = request.file?.mimetype.split('/')[0] == "image"

  if (!isFileAImage) {
    return response.status(400).send({
      message: "Invalid file type."
    })
  }

  const { name, price, description, category } = productSchema.parse(request.body)

  const imageUrl = `http://localhost:3000/uploads/${request.file?.filename}`

  console.log(request.file)
}