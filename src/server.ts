import express from "express"
import { usersRouter } from '../src/http/users/routes'


const app = express()
app.use(express.json())
app.use("/", usersRouter)


app.listen(3000, () => {
  console.log("🚀 Server is running on port 3000")
})