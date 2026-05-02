export const capitalise = (str: string): string => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str
}

export const pluralise = (count: number, singular: string, plural: string): string => {
  if (count === 1) return singular
  return plural
}
