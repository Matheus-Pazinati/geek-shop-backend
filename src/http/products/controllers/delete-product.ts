import { ProductsPostgresqlRepository } from "@/database/repositories/postgresql/products-postgresql-repository"
import { multerDeleteProductImageFromPath} from "@/http/utils/multer-delete-image-from-path"
import { DeleteProductUseCase } from "@/use-cases/delete-product"
import { NotAllowedError } from "@/use-cases/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"
import { Response } from "express"
import { ZodError, z } from "zod"

export async function deleteProduct(request: any, response: Response) {
  const deleteProductSchema = z.object({
    id: z.string().nonempty()
  })

  try {
    const { id } = deleteProductSchema.parse(request.params)
    const ownerId = await request.user.id

    const productsRepository = new ProductsPostgresqlRepository()
    const deleteUseCase = new DeleteProductUseCase(productsRepository)

    const { product }: any = await deleteUseCase.execute({
      productId: id,
      ownerId
    })
    
    await multerDeleteProductImageFromPath(product.image_url)

    return response.status(200).send()

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