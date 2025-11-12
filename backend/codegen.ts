import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: '../schema.graphql',
  generates: {
    './src/graphql/resolver-types.ts': {
      config: {
        useIndexSignature: true,
        useTypeImports: true,
        scalars: {
          ID: {
            input: 'GlobalId',
            output: 'GlobalId',
          },
          DateTime: 'Date',
        },
      },
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
}
export default config
