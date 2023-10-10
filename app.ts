import express from "express"
import { usersRouter } from 'src/http/users/routes'
import { productsRouter } from "src/http/products/routes"

export const app = express()

app.use(express.static('public'));

app.use(express.json())

app.use("/", usersRouter)

app.use("/products", productsRouter)