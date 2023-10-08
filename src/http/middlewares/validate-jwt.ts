import { NextFunction, Response } from "express"
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export async function validateJWT(request: any, response: Response, next: NextFunction) {
  const authHeader = request.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return response.status(401).end()
  }

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
    if (err) return response.status(403).end()

    request.user = user

    next()
  })
}