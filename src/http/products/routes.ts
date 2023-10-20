import express from 'express'
import { addProduct } from './controllers/add-product'
import { validateJWT } from '../middlewares/validate-jwt'
import { handleImagesUploadWithMulter } from '../middlewares/multer-image-update'
import { getProduct } from './controllers/get-product'
import { deleteProduct } from './controllers/delete-product'
import { fetchProducts } from './controllers/fetch-products'
import { fetchOwnerProducts } from './controllers/fetch-owner-products'

export const productsRouter = express.Router()

productsRouter.post('/add', validateJWT, handleImagesUploadWithMulter, addProduct)
productsRouter.get('/all', fetchProducts)
productsRouter.get('/owner-products', validateJWT, fetchOwnerProducts)
productsRouter.get('/:id', getProduct)
productsRouter.delete('/:id', validateJWT, deleteProduct)