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
        // The hand-written unions in database/types.ts are the single source of
        // truth for these enums: the database columns store exactly these values.
        enumValues: {
          DayOfWeek: '../database/types.ts#DayOfWeek',
          DaySection: '../database/types.ts#DaySection',
        },
        mappers: {
          User: '../user/user-domain.ts#UserNode',
          Task: '../task/task-domain.ts#TaskNode',
          RoutineSlot: '../routine-slot/routine-slot-domain.ts#RoutineSlotNode',
          TaskCompletion:
            '../task-completion/task-completion-domain.ts#TaskCompletionNode',
          PushSubscription:
            '../push/push-domain.ts#PushSubscriptionNode',
          DailyRoutinePayload: '../schedule/schedule-domain.ts#DailyRoutineData',
          WeeklySchedulePayload: '../schedule/schedule-domain.ts#WeeklyScheduleData',
          DaySchedule: '../schedule/schedule-domain.ts#DayScheduleData',
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
