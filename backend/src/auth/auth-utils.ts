import { randomBytes } from 'crypto'
import { hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const generateRefreshToken = (): string => {
  return randomBytes(32).toString('base64')
}

export const hashRefreshToken = async (token: string): Promise<string> => {
  return hash(token, 10)
}

export const createAccessToken = (userId: number, secret: string): string => {
  return jwt.sign({ userId }, secret, {
    expiresIn: '10m',
  })
}

export const getRefreshTokenExpiry = (): string => {
  const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  return expiryDate.toISOString()
}

export const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60
