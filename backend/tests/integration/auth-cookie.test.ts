import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { randomBytes } from 'crypto'
import { clearAllTables } from '../helpers/db.ts'
import { createTestApp } from '../helpers/graphql.ts'

type App = Awaited<ReturnType<typeof createTestApp>>['app']

let app: App

beforeAll(async () => {
  app = (await createTestApp()).app
})

beforeEach(async () => {
  await clearAllTables()
})

const refreshCookieOf = (response: Awaited<ReturnType<App['inject']>>) =>
  response.cookies.find(cookie => cookie.name === 'refreshToken')

const refreshCookiesOf = (response: Awaited<ReturnType<App['inject']>>) =>
  response.cookies
    .filter(cookie => cookie.name === 'refreshToken')
    .map(cookie => ({ path: cookie.path, cleared: cookie.value === '' }))

const credentials = () => ({
  email: `cookie-${randomBytes(6).toString('hex')}@example.com`,
  name: 'Cookie Test',
  password: 'correct-horse',
})

describe('refresh token cookie', () => {
  it('is scoped to the whole site on signup, login and refresh', async () => {
    const user = credentials()

    const signup = await app.inject({
      method: 'POST',
      url: '/api/signup',
      payload: user,
    })
    expect(refreshCookieOf(signup)?.path).toBe('/')

    const login = await app.inject({
      method: 'POST',
      url: '/api/login',
      payload: { email: user.email, password: user.password },
    })
    const loginCookie = refreshCookieOf(login)
    expect(loginCookie?.path).toBe('/')

    const refresh = await app.inject({
      method: 'GET',
      url: '/api/refresh',
      cookies: { refreshToken: loginCookie!.value },
    })
    expect(refresh.statusCode).toBe(200)
    expect(refreshCookieOf(refresh)?.path).toBe('/')
  })

  it('is cleared at the same path it was set on logout', async () => {
    const user = credentials()
    const signup = await app.inject({
      method: 'POST',
      url: '/api/signup',
      payload: user,
    })

    const logout = await app.inject({
      method: 'POST',
      url: '/api/logout',
      cookies: { refreshToken: refreshCookieOf(signup)!.value },
    })
    const cleared = refreshCookieOf(logout)
    expect(cleared?.value).toBe('')
    expect(cleared?.path).toBe('/')
  })

  it('is cleared at the same path when refresh is rejected', async () => {
    const refresh = await app.inject({
      method: 'GET',
      url: '/api/refresh',
      cookies: { refreshToken: 'not-a-real-token' },
    })
    expect(refresh.statusCode).toBe(401)
    expect(refreshCookieOf(refresh)?.path).toBe('/')
  })

  it('retires the legacy /api cookie whenever it issues a new one', async () => {
    const user = credentials()
    await app.inject({ method: 'POST', url: '/api/signup', payload: user })

    const login = await app.inject({
      method: 'POST',
      url: '/api/login',
      payload: { email: user.email, password: user.password },
    })

    expect(refreshCookiesOf(login)).toEqual([
      { path: '/', cleared: false },
      { path: '/api', cleared: true },
    ])
  })

  it('refreshes from a legacy /api cookie and moves it to the site-wide path', async () => {
    const user = credentials()
    const signup = await app.inject({
      method: 'POST',
      url: '/api/signup',
      payload: user,
    })
    const legacyToken = refreshCookieOf(signup)!.value

    const refresh = await app.inject({
      method: 'GET',
      url: '/api/refresh',
      cookies: { refreshToken: legacyToken },
    })

    expect(refresh.statusCode).toBe(200)
    expect(refreshCookiesOf(refresh)).toEqual([
      { path: '/', cleared: false },
      { path: '/api', cleared: true },
    ])
  })

  it('clears both paths when a refresh is rejected', async () => {
    const refresh = await app.inject({
      method: 'GET',
      url: '/api/refresh',
      cookies: { refreshToken: 'not-a-real-token' },
    })

    expect(refresh.statusCode).toBe(401)
    expect(refreshCookiesOf(refresh)).toEqual([
      { path: '/', cleared: true },
      { path: '/api', cleared: true },
    ])
  })
})
