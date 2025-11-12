import { getDirname, getFilename } from './paths.ts'
import { resolve } from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'
import { styleText } from 'node:util'

const TEMPLATE = `// GENERATED FILE
// DO NOT EDIT
import type { GlobalId } from '../globalId.ts'
`

const __dirname = getDirname(import.meta.url)
const resolverTypeFile = resolve(__dirname, '../src/graphql/resolver-types.ts')

const existingContent = await readFile(resolverTypeFile, 'utf-8')

await writeFile(resolverTypeFile, `${TEMPLATE}${existingContent}`, 'utf-8')

console.log(styleText('green', '\u2714') + ' Types fix-up completed')
