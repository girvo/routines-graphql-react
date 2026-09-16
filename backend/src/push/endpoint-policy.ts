import { GraphQLError } from 'graphql'
import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

/**
 * Resolves a push-service hostname to the addresses we would actually dial.
 * Injected rather than called inline so tests never depend on live DNS, and so
 * the whole policy can be exercised deterministically.
 */
export type HostAddressResolver = (hostname: string) => Promise<string[]>

export const dnsHostAddressResolver: HostAddressResolver = async hostname => {
  const addresses = await lookup(hostname, { all: true, verbatim: true })

  return addresses.map(entry => entry.address)
}

export const UNSAFE_ENDPOINT_MESSAGE =
  'Push subscription endpoint must be a public https:// push service URL'

const badEndpoint = () =>
  new GraphQLError(UNSAFE_ENDPOINT_MESSAGE, {
    extensions: { code: 'BAD_USER_INPUT' },
  })

const parseOctets = (address: string): number[] | null => {
  const parts = address.split('.')
  if (parts.length !== 4) return null

  const octets: number[] = []
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null
    const value = Number(part)
    if (value > 255) return null
    octets.push(value)
  }

  return octets
}

const toUint32 = (octets: number[]): number =>
  octets.reduce((acc, octet) => acc * 256 + octet, 0) >>> 0

/**
 * IANA special-purpose registry, minus the ranges a browser push service can
 * legitimately live on. Anything matched here is either routable only inside a
 * network (private, link-local, CGNAT), self-referential (loopback, "this
 * network"), reserved for documentation/benchmarking, or multicast.
 */
const BLOCKED_IPV4_RANGES: Array<[string, number]> = [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.0.2.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['198.51.100.0', 24],
  ['203.0.113.0', 24],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
]

const inBlockedIpv4Range = (address: number): boolean =>
  BLOCKED_IPV4_RANGES.some(([cidr, bits]) => {
    const network = toUint32(parseOctets(cidr)!)
    const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0

    return (address & mask) === (network & mask)
  })

const isPublicIpv4 = (address: string): boolean => {
  const octets = parseOctets(address)
  if (octets === null) return false

  return !inBlockedIpv4Range(toUint32(octets))
}

/**
 * IPv6 text -> 16 bytes, including the trailing embedded-IPv4 form
 * (`::ffff:1.2.3.4`). `isIP` has already accepted the text, so this only has to
 * handle `::` compression rather than every historical variant.
 */
const parseIpv6Bytes = (address: string): Uint8Array | null => {
  let text = address.split('%')[0]

  // A trailing embedded IPv4 (`::ffff:1.2.3.4`) is just two more 16-bit words.
  const embedded = /:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/.exec(text)
  if (embedded) {
    const octets = parseOctets(embedded[1])
    if (octets === null) return null
    const high = octets[0] * 256 + octets[1]
    const low = octets[2] * 256 + octets[3]
    text = `${text.slice(0, embedded.index + 1)}${high.toString(16)}:${low.toString(16)}`
  }

  const parseWords = (group: string): number[] | null => {
    if (group === '') return []

    const words: number[] = []
    for (const part of group.split(':')) {
      if (!/^[0-9a-fA-F]{1,4}$/.test(part)) return null
      words.push(parseInt(part, 16))
    }

    return words
  }

  const [leftText = '', ...rest] = text.split('::')
  if (rest.length > 1) return null

  const compressed = text.includes('::')
  const left = parseWords(leftText)
  const right = compressed ? parseWords(rest[0] ?? '') : []
  if (left === null || right === null) return null

  if (
    compressed
      ? left.length + right.length > 7
      : left.length + right.length !== 8
  ) {
    return null
  }

  const bytes = new Uint8Array(16)
  const fill = (values: number[], byteOffset: number) => {
    values.forEach((value, index) => {
      bytes[byteOffset + index * 2] = (value >> 8) & 0xff
      bytes[byteOffset + index * 2 + 1] = value & 0xff
    })
  }

  fill(left, 0)
  fill(right, 16 - right.length * 2)

  return bytes
}

const hasPrefix = (
  bytes: Uint8Array,
  prefix: number[],
  bits: number,
): boolean => {
  for (let index = 0; index < bits; index += 8) {
    const remaining = bits - index
    const mask = remaining >= 8 ? 0xff : (0xff << (8 - remaining)) & 0xff
    if ((bytes[index / 8] & mask) !== ((prefix[index / 8] ?? 0) & mask)) {
      return false
    }
  }

  return true
}

const isPublicIpv6 = (address: string): boolean => {
  const bytes = parseIpv6Bytes(address)
  if (bytes === null) return false

  if (bytes.every(byte => byte === 0)) return false

  const bytesAt = (offset: number): string =>
    [
      bytes[offset],
      bytes[offset + 1],
      bytes[offset + 2],
      bytes[offset + 3],
    ].join('.')

  if (bytes.slice(0, 10).every(byte => byte === 0)) {
    if (bytes[10] === 0xff && bytes[11] === 0xff) {
      // `::ffff:a.b.c.d` hides the real destination, so judge the inner IPv4.
      return isPublicIpv4(bytesAt(12))
    }

    // The deprecated v4-compatible form (`::a.b.c.d`, and `::1`) is not
    // routable on the public internet, so it is never a valid push endpoint.
    if (bytes[10] === 0x00 && bytes[11] === 0x00) return false
  }

  if (hasPrefix(bytes, [0x20, 0x02], 16)) {
    // 6to4 carries an IPv4 address in bytes 2-5.
    return isPublicIpv4(bytesAt(2))
  }

  if (hasPrefix(bytes, [0x00, 0x64, 0xff, 0x9b], 48)) {
    // Well-known NAT64 prefix embeds the IPv4 destination.
    return isPublicIpv4(bytesAt(12))
  }

  const blocked: Array<[number[], number]> = [
    [[0x01, 0x00], 64], // 100::/64 discard-only
    [[0x20, 0x01, 0x00], 32], // 2001::/32 Teredo
    [[0x20, 0x01, 0x0d, 0xb8], 32], // 2001:db8::/32 documentation
    [[0xfc], 7], // fc00::/7 unique-local
    [[0xfe, 0x80], 10], // fe80::/10 link-local
    [[0xff], 8], // ff00::/8 multicast
  ]

  return !blocked.some(([prefix, bits]) => hasPrefix(bytes, prefix, bits))
}

export const isPublicIpAddress = (address: string): boolean => {
  const stripped = address.startsWith('[') ? address.slice(1, -1) : address

  switch (isIP(stripped)) {
    case 4:
      return isPublicIpv4(stripped)
    case 6:
      return isPublicIpv6(stripped)
    default:
      return false
  }
}

/**
 * Push endpoints are attacker-chosen URLs that this server later dials, so they
 * are a server-side request forgery vector. Rather than allowlisting push
 * service origins (browsers hand out endpoints on hosts we cannot enumerate
 * across vendors and regions), the rule is: https on 443 only, and every
 * address the host resolves to must be globally reachable. Loopback, private,
 * CGNAT, link-local (cloud metadata), multicast and reserved ranges are
 * rejected, in both IPv4 and IPv6, including the embedded-IPv4 forms that would
 * otherwise smuggle a private address through.
 *
 * The literal host is canonicalised by the URL parser first, which is what
 * turns `https://2130706433`, `https://0x7f000001` and `https://0177.0.0.1` into
 * `127.0.0.1` and therefore into a rejection.
 */
export const assertPublicPushEndpoint = async (
  endpoint: string,
  resolveAddresses: HostAddressResolver = dnsHostAddressResolver,
): Promise<string> => {
  let url: URL

  try {
    url = new URL(endpoint)
  } catch {
    throw badEndpoint()
  }

  if (url.protocol !== 'https:') throw badEndpoint()

  // The URL parser drops the default 443, so any surviving port is non-standard.
  if (url.port !== '') throw badEndpoint()

  const hostname = url.hostname.replace(/^\[|\]$/g, '')
  if (hostname === '') throw badEndpoint()

  const addresses: string[] = isIP(hostname) === 0 ? [] : [hostname]
  if (addresses.length === 0) {
    try {
      addresses.push(...(await resolveAddresses(hostname)))
    } catch {
      throw badEndpoint()
    }
  }

  if (addresses.length === 0) throw badEndpoint()
  if (!addresses.every(isPublicIpAddress)) throw badEndpoint()

  return url.toString()
}
