import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: '../schema.graphql',
  documents: './tests/**/*.ts',
  emitLegacyCommonJSImports: false,
  generates: {
    './src/graphql/resolver-types.ts': {
      config: {
        useIndexSignature: true,
        useTypeImports: true,
        enumsAsTypes: true,
        futureProofEnums: true,
        futureProofUnions: true,
        scalars: {
          ID: '../globalId.ts#GlobalId',
          DateTime: 'Date',
          NonNegativeInt: 'number',
        },
        mappers: {
          User: '../user/user-domain.ts#UserNode',
          Task: '../task/task-domain.ts#TaskNode',
          RoutineSlot: '../routine-slot/routine-slot-domain.ts#RoutineSlotNode',
          TaskCompletion:
            '../task-completion/task-completion-domain.ts#TaskCompletionNode',
        },
      },
      plugins: ['typescript', 'typescript-resolvers'],
    },
    './tests/gql/': {
      preset: 'client',
      config: {
        useIndexSignature: true,
        useTypeImports: true,
        enumsAsTypes: true,
        futureProofEnums: true,
        futureProofUnions: true,
        scalars: {
          ID: '../../src/globalId.ts#GlobalId',
          DateTime: 'Date',
          NonNegativeInt: 'number',
        },
      },
      hooks: {
        afterAllFileWrite: ['node tools/fix-import-extensions.ts'],
      },
    },
  },
}
export default config
