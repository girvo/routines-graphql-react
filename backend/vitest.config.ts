import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    include: ['./tests/**/*.test.ts'],
    // exclude: ['./tests/*']
  },
  // resolve: {
  //   alias: {
  //     '@graphql-typed-document-node/core': '@graphql-typed-document-node/core/typings',
  //   },
  // },
})
