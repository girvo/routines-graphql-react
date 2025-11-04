export const getEnv = () => {
  const { JWT_SECRET, NODE_ENV } = process.env

  if (!JWT_SECRET) {
    throw new Error('Please pass a JWT secret to the environment')
  }

  let ENVIRONMENT: 'development' | 'production' | 'test' = 'development'
  switch (NODE_ENV) {
    case 'production':
      ENVIRONMENT = 'production'
      break
    case 'test':
      ENVIRONMENT = 'test'
      break
    case 'development':
    default:
      ENVIRONMENT = 'development'
      break
  }

  return {
    JWT_SECRET,
    ENVIRONMENT,
  }
}
