// @vitest-environment jsdom
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest'
import {
  detectPlatform,
  fetchVapidPublicKey,
  getPermissionState,
  isPushCapable,
  isStandalone,
  subscribeCurrentDevice,
  urlBase64ToUint8Array,
} from './push-client.ts'

const VAPID_PUBLIC_KEY =
  'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkAoAxdO6WXXhz5bAtCAaJtAviaQ1u2YEh6xEde8uM'

const defineNavigator = (properties: Record<string, unknown>) => {
  for (const [key, value] of Object.entries(properties)) {
    if (value === undefined) {
      Reflect.deleteProperty(navigator, key)
      continue
    }

    Object.defineProperty(navigator, key, { value, configurable: true })
  }
}

const stubFetch = (response: {
  ok: boolean
  status?: number
  body?: unknown
}) =>
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async () =>
        new Response(JSON.stringify(response.body ?? {}), {
          status: response.status ?? (response.ok ? 200 : 503),
          headers: { 'content-type': 'application/json' },
        }),
    ),
  )

beforeEach(() => {
  vi.stubGlobal('Notification', undefined)
  delete (window as unknown as Record<string, unknown>).PushManager
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('urlBase64ToUint8Array', () => {
  it('decodes unpadded base64url', () => {
    expect(urlBase64ToUint8Array('QQ')).toEqual(new Uint8Array([65]))
    expect(urlBase64ToUint8Array('QQI')).toEqual(new Uint8Array([65, 2]))
    expect(urlBase64ToUint8Array('QQJ_')).toEqual(new Uint8Array([65, 2, 127]))
  })

  it('decodes a VAPID public key into an uncompressed P-256 point', () => {
    const bytes = urlBase64ToUint8Array(VAPID_PUBLIC_KEY)

    expect(bytes).toHaveLength(65)
    expect(bytes[0]).toBe(0x04)
  })
})

describe('detectPlatform', () => {
  it('labels iPhones and touch-capable Macs as iOS', () => {
    expect(
      detectPlatform(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        5,
      ),
    ).toBe('iOS')
    expect(
      detectPlatform(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
        5,
      ),
    ).toBe('iOS')
  })

  it('labels a touchless Mac browser as macOS and everything else as other', () => {
    expect(
      detectPlatform(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        0,
      ),
    ).toBe('macOS')
    expect(
      detectPlatform('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', 0),
    ).toBe('other')
  })
})

describe('isPushCapable', () => {
  it('requires both a service worker and PushManager', () => {
    defineNavigator({ serviceWorker: {} })

    expect(isPushCapable()).toBe(false)

    vi.stubGlobal('PushManager', class {})

    expect(isPushCapable()).toBe(true)
  })

  it('is false without a service worker', () => {
    defineNavigator({ serviceWorker: undefined })
    vi.stubGlobal('PushManager', class {})

    expect(isPushCapable()).toBe(false)
  })
})

describe('isStandalone', () => {
  const setDisplayMode = (matches: boolean) => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(display-mode: standalone)' && matches,
    }))
  }

  it('reads the iOS standalone flag', () => {
    setDisplayMode(false)
    defineNavigator({ standalone: true })

    expect(isStandalone()).toBe(true)
  })

  it('reads the display-mode media query for desktop installs', () => {
    defineNavigator({ standalone: undefined })
    setDisplayMode(true)

    expect(isStandalone()).toBe(true)
  })

  it('is false in a normal browser tab', () => {
    defineNavigator({ standalone: undefined })
    setDisplayMode(false)

    expect(isStandalone()).toBe(false)
  })
})

describe('getPermissionState', () => {
  it('reports unsupported when the Notification API is missing', () => {
    expect(getPermissionState()).toBe('unsupported')
  })

  it('reports the platform permission', () => {
    vi.stubGlobal('Notification', { permission: 'denied' })

    expect(getPermissionState()).toBe('denied')
  })
})

describe('fetchVapidPublicKey', () => {
  it('returns the configured key', async () => {
    stubFetch({ ok: true, body: { publicKey: VAPID_PUBLIC_KEY } })

    await expect(fetchVapidPublicKey()).resolves.toBe(VAPID_PUBLIC_KEY)
  })

  it('returns null when the server has no VAPID keys', async () => {
    stubFetch({ ok: false, status: 503, body: { error: 'not configured' } })

    await expect(fetchVapidPublicKey()).resolves.toBeNull()
  })
})

describe('subscribeCurrentDevice', () => {
  const endpoint = 'https://push.example.com/subscriptions/abc'

  interface SubscriptionJson {
    endpoint: string
    keys: { p256dh: string; auth: string }
  }

  type Subscribe = (options: {
    userVisibleOnly: boolean
    applicationServerKey: Uint8Array
  }) => Promise<{ toJSON: () => SubscriptionJson }>

  const stubPushManager = (
    subscribe: Mock<Subscribe> = vi.fn(async () => ({
      toJSON: () => ({
        endpoint,
        keys: { p256dh: 'BmockP256dh', auth: 'mockAuth' },
      }),
    })),
  ) => {
    defineNavigator({
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
      maxTouchPoints: 5,
      serviceWorker: { ready: Promise.resolve({ pushManager: { subscribe } }) },
    })

    return subscribe
  }

  it('subscribes with the VAPID key and reports the device subscription', async () => {
    stubFetch({ ok: true, body: { publicKey: VAPID_PUBLIC_KEY } })
    const subscribe = stubPushManager()

    const subscription = await subscribeCurrentDevice()

    const [options] = subscribe.mock.calls[0]
    expect(options.userVisibleOnly).toBe(true)
    expect(options.applicationServerKey).toEqual(
      urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    )

    expect(subscription).toEqual({
      endpoint,
      keys: { p256dh: 'BmockP256dh', auth: 'mockAuth' },
      platform: 'iOS',
    })
  })

  it('fails when the server is not configured for push', async () => {
    stubFetch({ ok: false, status: 503 })
    stubPushManager()

    await expect(subscribeCurrentDevice()).rejects.toThrow(
      'The server is not configured for push notifications yet',
    )
  })

  it('fails when the browser returns an incomplete subscription', async () => {
    stubFetch({ ok: true, body: { publicKey: VAPID_PUBLIC_KEY } })
    stubPushManager(
      vi.fn(async () => ({
        toJSON: () => ({ endpoint, keys: { p256dh: '', auth: '' } }),
      })),
    )

    await expect(subscribeCurrentDevice()).rejects.toThrow(
      'The browser returned an incomplete push subscription',
    )
  })
})
