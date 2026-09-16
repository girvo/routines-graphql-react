const DEFAULT_TITLE = 'Routines'
const DEFAULT_URL = '/'

self.addEventListener('push', event => {
  const payload = event.data ? event.data.json() : {}

  event.waitUntil(
    self.registration.showNotification(payload.title || DEFAULT_TITLE, {
      body: payload.body || '',
      tag: payload.tag,
      data: { url: payload.url || DEFAULT_URL },
    }),
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()

  const target = new self.URL(
    event.notification.data?.url || DEFAULT_URL,
    self.location.href,
  ).href

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        for (const client of windowClients) {
          if (!('focus' in client)) continue
          return 'navigate' in client
            ? client.navigate(target).then(() => client.focus())
            : client.focus()
        }
        return self.clients.openWindow(target)
      }),
  )
})
