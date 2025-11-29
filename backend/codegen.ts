import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: '../schema.graphql',
  generates: {
    './src/graphql/resolver-types.ts': {
      config: {
        useIndexSignature: true,
        useTypeImports: true,
        enumsAsTypes: true,
        futureProofEnums: true,
        futureProofUnions: true,
        scalars: {
          ID: {
            input: 'GlobalId',
            output: 'GlobalId',
          },
          DateTime: 'Date',
        },
        mappers: {
          GlobalId: '../globalId.ts#GlobalId',
          User: '../user/user-domain.ts#UserNode',
          Task: '../task/task-domain.ts#TaskNode',
          // Add others as you create them
        },
      },
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
}
export default config
