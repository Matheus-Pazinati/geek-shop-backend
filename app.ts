import express from "express"
import { usersRouter } from 'src/http/users/routes'
import { productsRouter } from "src/http/products/routes"
import { validateJWT } from "@/http/middlewares/validate-jwt";

export const app = express()

app.use(express.static('public'));

app.use(express.json())

app.use("/", usersRouter)

app.use("/products/add", validateJWT)

app.use("/products", productsRouter)