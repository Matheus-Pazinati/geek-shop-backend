import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";

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
}).single('product_image')

export async function handleImagesUploadWithMulter(request: Request, response: Response, next: NextFunction) {
  upload(request, response, (err) => {
    if (err instanceof multer.MulterError) {
      response.status(400).send({
        message: "An error occurred when trying to upload the image."
      })
    } else if (err) {
      response.status(500).send({
        message: "Internal server error."
      })
    }

    if (request.file != undefined) {
      response.locals.image = `http://localhost:3000/uploads/${request.file?.filename}`
      next()
    } else {
      response.locals.image = null
      next()
    }

  })
}