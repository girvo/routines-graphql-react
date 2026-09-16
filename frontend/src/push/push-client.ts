export type DevicePlatform = 'iOS' | 'macOS' | 'other'

export interface DeviceSubscription {
  endpoint: string
  keys: { p256dh: string; auth: string }
  platform: DevicePlatform
}

const SERVICE_WORKER_PATH = '/sw.js'

export const isPushCapable = (): boolean =>
  'serviceWorker' in navigator && 'PushManager' in window

/**
 * iOS only offers push to an app launched from its Home Screen icon, so the
 * settings UI has to distinguish that from a normal Safari tab.
 */
export const isStandalone = (): boolean => {
  if (typeof window === 'undefined') return false

  if ((navigator as Navigator & { standalone?: boolean }).standalone === true) {
    return true
  }

  return window.matchMedia('(display-mode: standalone)').matches
}

export const getPermissionState = (): NotificationPermission | 'unsupported' =>
  typeof Notification === 'undefined' ? 'unsupported' : Notification.permission

/**
 * iPadOS Safari reports a macOS UA string, so touch support decides between the
 * two; a real Mac with a trackpad reports zero touch points.
 */
export const detectPlatform = (
  userAgent: string,
  maxTouchPoints: number,
): DevicePlatform => {
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'iOS'
  if (/Macintosh|Mac OS X/.test(userAgent)) {
    return maxTouchPoints > 1 ? 'iOS' : 'macOS'
  }

  return 'other'
}

export const currentPlatform = (): DevicePlatform =>
  detectPlatform(navigator.userAgent, navigator.maxTouchPoints ?? 0)

export const urlBase64ToUint8Array = (
  base64String: string,
): Uint8Array<ArrayBuffer> => {
  const base64 = base64String.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    '=',
  )
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

export const registerServiceWorker =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if (!('serviceWorker' in navigator)) return null

    return navigator.serviceWorker.register(SERVICE_WORKER_PATH, { scope: '/' })
  }

/**
 * `null` means the backend has no VAPID keys configured (it answers 503), which
 * the UI shows as "not configured" rather than as a failure.
 */
export const fetchVapidPublicKey = async (): Promise<string | null> => {
  const response = await fetch('/api/push/public-key', {
    headers: { accept: 'application/json' },
  })

  if (!response.ok) return null

  const body = (await response.json()) as { publicKey?: unknown }

  return typeof body.publicKey === 'string' && body.publicKey.length > 0
    ? body.publicKey
    : null
}

export const subscribeCurrentDevice = async (): Promise<DeviceSubscription> => {
  const publicKey = await fetchVapidPublicKey()

  if (!publicKey) {
    throw new Error('The server is not configured for push notifications yet')
  }

  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  })

  const { endpoint, keys } = subscription.toJSON()

  if (!endpoint || !keys?.p256dh || !keys.auth) {
    throw new Error('The browser returned an incomplete push subscription')
  }

  return {
    endpoint,
    keys: { p256dh: keys.p256dh, auth: keys.auth },
    platform: currentPlatform(),
  }
}

/**
 * With an endpoint, only the matching local subscription is dropped: removing a
 * second device from this one must not unsubscribe the current browser.
 */
export const unsubscribeCurrentDevice = async (
  endpoint?: string,
): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) return false

  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()

  if (!subscription) return false
  if (endpoint !== undefined && subscription.endpoint !== endpoint) return false

  return subscription.unsubscribe()
}
