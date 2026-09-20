import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: '../schema.graphql',
  documents: './tests/**/*.ts',
  emitLegacyCommonJSImports: false,
  // NOTE: output-level lifecycle hooks are broken upstream (open bug since 2022:
  // github.com/dotansimha/graphql-code-generator/issues/8574 — the config is
  // dropped before it reaches the write site), and root-level hooks only fire on
  // files codegen actually writes (hash-identical outputs are skipped) while
  // swallowing all hook output unless config.debug is set. Post-processing steps
  // therefore run as explicit parts of the resolvers:generate script instead.
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
          PushSubscription: '../push/push-domain.ts#PushSubscriptionNode',
          DailyRoutinePayload:
            '../schedule/schedule-domain.ts#DailyRoutineData',
          WeeklySchedulePayload:
            '../schedule/schedule-domain.ts#WeeklyScheduleData',
          DaySchedule: '../schedule/schedule-domain.ts#DayScheduleData',
          DaySectionSlots: '../schedule/schedule-domain.ts#DaySectionSlotsData',
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
    },
  },
}
export default config
