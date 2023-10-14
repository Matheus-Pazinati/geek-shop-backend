import express from 'express'
import { addProduct } from './controllers/add-product'
import { validateJWT } from '../middlewares/validate-jwt'
import { handleImagesUploadWithMulter } from '../middlewares/multer-image-update'
import { getProduct } from './controllers/get-product'

export const productsRouter = express.Router()

productsRouter.post('/add', validateJWT, handleImagesUploadWithMulter, addProduct)
productsRouter.get('/:id', getProduct)