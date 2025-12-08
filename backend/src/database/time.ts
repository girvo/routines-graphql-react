import { format } from 'date-fns'

export function getCurrentTimestamp(): string {
  return format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS')
}
