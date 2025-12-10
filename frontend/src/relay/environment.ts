import {
  Environment,
  Network,
  RecordSource,
  Store,
  type CacheConfig,
  type GraphQLResponse,
  type RequestParameters,
  type UploadableMap,
  type Variables,
} from 'relay-runtime'
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from '../login/AuthContext'

// const fetchGraphQL: FetchFunction = async (request, variables) => {
//   const resp = await fetch(HTTP_ENDPOINT, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ query: request.text, variables }),
//   })
//   if (!resp.ok) {
//     throw new Error('Response failed.')
//   }
//   return await resp.json()
// }

// export const environment = new Environment({
//   network: Network.create(fetchGraphQL),
//   store: new Store(new RecordSource({})),
// })

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

async function fetchGraphQLRequest(
  operation: RequestParameters,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables: UploadableMap | null | undefined,
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

  const json = await response.json()

  const hasAuthError =
    response.status === 401 ||
    json.errors?.some(
      (err: { extensions?: { code?: string } }) =>
        err.extensions?.code === 'UNAUTHENTICATED',
    )

  if (hasAuthError && attempt === 0) {
    try {
      const newToken = await refreshAccessToken()
      setAccessToken(newToken)

      return fetchGraphQLRequest(
        operation,
        variables,
        cacheConfig,
        uploadables,
        1,
      )
    } catch (error) {
      clearAccessToken()
      throw error
    }
  }

  return json
}

function fetchWithRetry(
  operation: RequestParameters,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables?: UploadableMap | null,
): Promise<GraphQLResponse> {
  return fetchGraphQLRequest(operation, variables, cacheConfig, uploadables, 0)
}

const network = Network.create(fetchWithRetry)

export const environment = new Environment({
  network,
  store: new Store(new RecordSource()),
})
