import express from 'express'
import { validateJWT } from '../middlewares/validate-jwt'
import { handleImagesUploadWithMulter } from '../middlewares/multer-image-update'
import { addProduct } from './controllers/add-product'
import { fetchProductsByCategory } from './controllers/fetch-products-by-category'
import { getProduct } from './controllers/get-product'
import { deleteProduct } from './controllers/delete-product'
import { fetchProducts } from './controllers/fetch-products'
import { fetchOwnerProducts } from './controllers/fetch-owner-products'

export const productsRouter = express.Router()

productsRouter.post('/add', validateJWT, handleImagesUploadWithMulter, addProduct)
productsRouter.get('/owner-products', validateJWT, fetchOwnerProducts)
productsRouter.get('/all', fetchProducts)
productsRouter.get('/categories/:category', fetchProductsByCategory)
productsRouter.get('/product/:id', getProduct)
productsRouter.delete('/:id', validateJWT, deleteProduct)