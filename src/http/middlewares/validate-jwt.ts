import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export async function validateJWT(request: any, response: Response, next: NextFunction) {
  const token = request.cookies.token

  if (token == null) {
    return response.status(401).end()
  }

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
    if (err) return response.status(403).end()

    request.user = user

    next()
  })
}