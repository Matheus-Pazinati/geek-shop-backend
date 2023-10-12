import express from 'express'
import { addProduct } from './controllers/add-product'
import multer from 'multer'
import path from 'node:path'

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



const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
      var ext = path.extname(file.originalname);
      if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
          return callback(new Error('Only images are allowed.'))
      }
      callback(null, true)
  },
  limits:{
      fileSize: 1024 * 1024
  }
})

export const productsRouter = express.Router()

productsRouter.post('/add', upload.single('product-image'), addProduct)