import {
  Environment,
  Network,
  RecordSource,
  Store,
  type FetchFunction,
} from 'relay-runtime'

const HTTP_ENDPOINT = 'http://127.0.0.1:4000/graphql'

const fetchGraphQL: FetchFunction = async (request, variables) => {
  const resp = await fetch(HTTP_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: request.text, variables }),
  })
  if (!resp.ok) {
    throw new Error('Response failed.')
  }
  return await resp.json()
}

export const environment = new Environment({
  network: Network.create(fetchGraphQL),
  store: new Store(new RecordSource({})),
})
