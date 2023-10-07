import { UUID } from "node:crypto";
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export interface UserTokenData {
  id: UUID,
  name: string
}

export function generateAcessToken({ id, name }: UserTokenData) {
  return jwt.sign({ id, name }, process.env.TOKEN_SECRET!, {
    expiresIn: '3d'
  })
}