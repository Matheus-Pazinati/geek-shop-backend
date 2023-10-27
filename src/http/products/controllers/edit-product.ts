import { CATEGORIES } from "@/database/models/product";
import { ProductsPostgresqlRepository } from "@/database/repositories/postgresql/products-postgresql-repository";
import { multerDeleteProductImageFromPath } from "@/http/utils/multer-delete-image-from-path";
import { EditProductUseCase, NewProductData } from "@/use-cases/edit-product";
import { NotAllowedError } from "@/use-cases/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { Response } from "express";
import { ZodError, z } from "zod";

export async function editProduct(request: any, response: Response) {
  const productSchema = z.object({
    name: z.string().max(30, { message: "You have exceeded the field's character limit: 30" }).optional(),
    description: z.string().nonempty().max(60, { message: "You have exceeded the field's character limit: 60" }).optional(),
    price: z.coerce.number().nonnegative().optional(),
    product_category: z.enum(CATEGORIES).optional()
  })

  const productIdSchema = z.object({
    productId: z.string().uuid().nonempty({ message: "Mandatory route parameter was not sent - id." })
  })

  try {
    const newProduct = productSchema.parse(await request.body)
    const { productId } = productIdSchema.parse(await request.params)

    const ownerId = await request.user.id

    const productImageWasChanged = await response.locals.image !== null

    let updatedProductData: NewProductData = newProduct

    const productsRepository = new ProductsPostgresqlRepository()

    const oldProduct: any = await productsRepository.findById(productId)

    if (productImageWasChanged) {
      updatedProductData = {
        ...newProduct,
        image_url: await response.locals.image
      }
      if (oldProduct) {
        multerDeleteProductImageFromPath(oldProduct.image_url)
      }
    }

    const editProductUseCase = new EditProductUseCase(productsRepository)

    await editProductUseCase.execute({
      newProductData: updatedProductData,
      ownerId,
      productId
    })

    return response.status(204).send()

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

    if (error instanceof NotAllowedError) {
      return response.status(401).send({
        message: error.message
      })
    }
  }
}