import express from "express"
import { usersRouter } from 'src/http/users/routes'
import { productsRouter } from "src/http/products/routes"
import cors from "cors"
import cookieParser from "cookie-parser"
import 'dotenv/config'

export const app = express();

app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL!);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL,
  methods: 'GET,POST,PUT,OPTIONS,DELETE'
}))

app.use(cookieParser())

app.use(express.json());

app.use("/", usersRouter);

app.use("/products", productsRouter);
