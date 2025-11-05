export const sqliteDateToDate = (input: string): Date => {
  return new Date(`${input.replace(' ', 'T')}Z`)
}
