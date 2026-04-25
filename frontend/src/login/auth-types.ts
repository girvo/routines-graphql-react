import { type } from 'arktype'

export const loginSchema = type({
  email: 'string.email',
  password: 'string',
})

export const signupSchema = type({
  email: 'string.email',
  name: 'string>0',
  password: 'string',
})

export type LoginFormData = typeof loginSchema.infer
export type SignupFormData = typeof signupSchema.infer
export type AuthFormData = SignupFormData

export const authSuccessResponse = type({
  success: 'true',
  accessToken: 'string',
})

export const authErrorResponse = type({
  success: 'false',
  errors: type({ message: 'string' }).array(),
})

export const authResponse = authSuccessResponse.or(authErrorResponse)
