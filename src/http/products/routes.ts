import express from 'express'
import { addProduct } from './controllers/add-product'
import { validateJWT } from '../middlewares/validate-jwt'
import { handleImagesUploadWithMulter } from '../middlewares/multer-image-update'
import { getProduct } from './controllers/get-product'
import { deleteProduct } from './controllers/delete-product'
import { fetchProducts } from './controllers/fetch-products'

export const productsRouter = express.Router()

productsRouter.post('/add', validateJWT, handleImagesUploadWithMulter, addProduct)
productsRouter.get('/:id', getProduct)
productsRouter.get('/', fetchProducts)
productsRouter.delete('/:id', validateJWT, deleteProduct)