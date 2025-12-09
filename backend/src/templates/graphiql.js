const TokenManager = {
  get() {
    return localStorage.getItem('accessToken')
  },

  set(token) {
    localStorage.setItem('accessToken', token)
  },

  clear() {
    localStorage.removeItem('accessToken')
  },

  isExpired(token) {
    if (!token) return true
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now() + 30000
    } catch {
      return true
    }
  },

  async refresh() {
    try {
      const response = await fetch('/api/refresh', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      })

      if (!response.ok) throw new Error('Refresh failed')

      const data = await response.json()
      const accessToken = data.accessToken

      if (!accessToken) {
        throw new Error('Could not get access token from response!')
      }

      this.set(accessToken)
      return accessToken
    } catch (error) {
      console.error('Token refresh failed:', error)
      localStorage.removeItem('accessToken')
      window.location.reload()
      return null
    }
  },
}

async function createGraphQLFetcher() {
  return async function fetcher(graphQLParams) {
    let token = TokenManager.get()

    if (TokenManager.isExpired(token)) {
      token = await TokenManager.refresh()
    }

    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      credentials: 'same-origin',
      body: JSON.stringify(graphQLParams),
    })

    if (response.status === 401) {
      console.warn('Received 401, attempting token refresh')
      const newToken = await TokenManager.refresh()

      if (newToken) {
        const retryResponse = await fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`,
          },
          credentials: 'same-origin',
          body: JSON.stringify(graphQLParams),
        })
        return retryResponse.json()
      }
    }

    return response.json()
  }
}

function renderLoginForm() {
  document.getElementById('graphiql').innerHTML = `
    <div id="login-container">
      <div id="login-form" x-data="{ email: '', password: '', error: '' }">
        <h2>Login to GraphiQL</h2>
        <form @submit.prevent="
          error = '';
          fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'same-origin',
          })
          .then(r => r.ok ? r.json() : r.json().then(err => Promise.reject(err.message || 'Login failed')))
          .then(data => {
            if (data.success && data.accessToken) {
              localStorage.setItem('accessToken', data.accessToken);
              window.location.reload();
            }
            if (data.errors) {
              throw new Error(data.errors[0].message)
            }
          })
          .catch(err => error = typeof err === 'string' ? err : 'Login failed')
        ">
          <div x-show="error" class="error" x-text="error"></div>

          <input type="email" placeholder="Email" x-model="email" required>
          <input type="password" placeholder="Password" x-model="password" required>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  `
}

async function renderGraphiQL() {
  const fetcher = await createGraphQLFetcher()

  ReactDOM.render(
    React.createElement(GraphiQL, {
      fetcher: fetcher,
      defaultEditorToolsVisibility: true,
    }),
    document.getElementById('graphiql'),
  )
}

async function initialize() {
  const token = TokenManager.get()

  if (!token) {
    renderLoginForm()
  } else {
    await renderGraphiQL()
  }
}

initialize()
