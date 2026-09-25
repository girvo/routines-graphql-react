import {
  Environment,
  Network,
  RecordSource,
  Store,
  type GraphQLResponse,
  type RequestParameters,
  type Variables,
} from 'relay-runtime'
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from '../auth/auth-store'

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = fetch('/api/refresh', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Send refresh token cookie
  })
    .then(async response => {
      if (!response.ok) {
        throw new Error('Refresh failed')
      }
      const data = await response.json()
      return data.accessToken
    })
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

type GraphQLErrorWithCode = { extensions?: { code?: string } }

const isGraphQLResponse = (body: unknown): body is GraphQLResponse =>
  typeof body === 'object' &&
  body !== null &&
  ('data' in body || 'errors' in body)

async function readGraphQLResponse(
  response: Response,
): Promise<GraphQLResponse> {
  const body: unknown = await response.json().catch(() => null)
  if (isGraphQLResponse(body)) return body
  throw new Error(`GraphQL request failed with HTTP ${response.status}`)
}

const hasUnauthenticatedError = (json: GraphQLResponse) =>
  'errors' in json &&
  (json.errors as GraphQLErrorWithCode[] | undefined)?.some(
    error => error.extensions?.code === 'UNAUTHENTICATED',
  ) === true

async function fetchGraphQLRequest(
  operation: RequestParameters,
  variables: Variables,
  attempt: number,
): Promise<GraphQLResponse> {
  const accessToken = getAccessToken()

  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  })

  const json =
    response.status === 401 ? null : await readGraphQLResponse(response)
  const hasAuthError = json === null || hasUnauthenticatedError(json)

  if (hasAuthError && attempt === 0) {
    try {
      const newToken = await refreshAccessToken()
      setAccessToken(newToken)
      return fetchGraphQLRequest(operation, variables, 1)
    } catch {
      clearAccessToken()
      window.location.href = '/'
      throw new Error('Session expired')
    }
  }

  if (json === null) throw new Error('Session expired')
  return json
}

function fetchWithRetry(
  operation: RequestParameters,
  variables: Variables,
): Promise<GraphQLResponse> {
  return fetchGraphQLRequest(operation, variables, 0)
}

const network = Network.create(fetchWithRetry)

export const environment = new Environment({
  network,
  store: new Store(new RecordSource()),
})
