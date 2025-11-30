import { parseISO } from 'date-fns'

export const sqliteDateToDate = (input: string): Date => {
  return parseISO(input)
}
