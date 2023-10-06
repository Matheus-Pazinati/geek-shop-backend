import express from "express"
import { usersRouter } from '../src/http/users/routes'

export const app = express()

app.use(express.json())
app.use("/", usersRouter)