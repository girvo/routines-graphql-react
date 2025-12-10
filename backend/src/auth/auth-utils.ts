import { randomBytes, createHmac } from 'crypto'
import { addDays } from 'date-fns'
import jwt from 'jsonwebtoken'

export const generateRefreshToken = (): string => {
  return randomBytes(32).toString('base64')
}

export const hashRefreshToken = (token: string, secret: string): string => {
  return createHmac('sha256', secret).update(token).digest('hex')
}

export const createAccessToken = (userId: number, secret: string): string => {
  return jwt.sign({ userId }, secret, {
    expiresIn: '1m',
  })
}

export const getRefreshTokenExpiry = (): string => {
  return addDays(new Date(), 7).toISOString()
}

export const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60
