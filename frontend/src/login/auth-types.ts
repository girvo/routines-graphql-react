import { type } from 'arktype'

export const authSchema = type({
  email: 'string.email',
  password: 'string',
})

export const authSuccessResponse = type({
  success: 'true',
  accessToken: 'string',
})

export const authErrorResponse = type({
  success: 'false',
  errors: type({ message: 'string' }).array(),
})

export const authResponse = authSuccessResponse.or(authErrorResponse)
