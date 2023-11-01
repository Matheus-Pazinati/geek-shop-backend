import express from "express"
import { usersRouter } from 'src/http/users/routes'
import { productsRouter } from "src/http/products/routes"
import cors from "cors"

export const app = express();

app.use(express.static('public'));

app.use(cors());

app.use(express.json());

app.use("/", usersRouter);

app.use("/products", productsRouter);
