import express from 'express'
import { createUser } from './controllers/create-user'
import { authenticateUser } from './controllers/authenticate-user'

export const usersRouter = express.Router()

usersRouter.post('/users', createUser)
usersRouter.post('/authentication', authenticateUser)