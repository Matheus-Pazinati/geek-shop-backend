import express from 'express'
import { addProduct } from './controllers/add-product'
import multer from 'multer'

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + Date.now() + '.' +extension)
  }
})



const upload = multer({ storage: storage })

export const productsRouter = express.Router()

productsRouter.post('/add', upload.single('product-image'), addProduct)