import fs from "fs";

export async function multerDeleteProductImageFromPath(imageUrl: string) {
  const imageName = imageUrl.split('uploads/')[1]
  const imagePath = `public/uploads/${imageName}`

  fs.unlink(imagePath, (err) => {
    if (!err) {
      return
    } else {
      console.log("Delete image failed.", err)
    }
  })
}