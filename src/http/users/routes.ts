import express from 'express'
import { createUser } from './controllers/create-user'

export const usersRouter = express.Router()

usersRouter.post('/users', createUser)