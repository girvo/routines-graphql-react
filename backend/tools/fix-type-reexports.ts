import fs from 'fs/promises'

const TARGET = 'src/graphql/resolver-types.ts'

/**
 * graphql-codegen emits mapped `enumValues` re-exports as value exports
 * (`export { DayOfWeek };`), which `verbatimModuleSyntax` rejects for
 * type-only imports. The generated file is types-only, so rewriting these
 * lines to `export type { ... };` is always safe.
 */
for (const file of process.argv.slice(2)) {
  if (!file.endsWith(TARGET)) continue

  let content = await fs.readFile(file, 'utf-8')
  const fixed = content.replace(/^export \{ (\w+) \};$/gm, 'export type { $1 };')

  if (fixed !== content) {
    await fs.writeFile(file, fixed)
    console.log(`Fixed type re-exports in ${file}`)
  }
}
