import express from 'express'

export const usersRouter = express.Router()

usersRouter.get('/users', (req, res) => {
  return res.json({ reply: "First Route!" })
})