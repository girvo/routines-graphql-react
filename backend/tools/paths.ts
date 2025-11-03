import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Gets the directory path of the calling module.
 * This is a utility to replicate CommonJS __dirname behavior in ES modules.
 *
 * @param importMetaUrl - Pass import.meta.url from the calling module
 * @returns The directory path of the calling module
 */
export const getDirname = (importMetaUrl: string): string => {
  const filename = fileURLToPath(importMetaUrl)
  return dirname(filename)
}

/**
 * Gets the file path of the calling module.
 * This is a utility to replicate CommonJS __filename behavior in ES modules.
 *
 * @param importMetaUrl - Pass import.meta.url from the calling module
 * @returns The file path of the calling module
 */
export const getFilename = (importMetaUrl: string): string => {
  return fileURLToPath(importMetaUrl)
}
