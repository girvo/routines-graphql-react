import type { JWTExtendContextFields } from '@graphql-yoga/plugin-jwt'
import { db } from '../database/index.ts'

export function createContext() {
  return {
    db,
    blah: 'this is very cool',
  }
}

export type Context = ReturnType<typeof createContext> & JWTExtendContextFields
