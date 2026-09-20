import type { Resolvers } from './resolver-types.ts'
import type { Context } from './context.ts'
import type { NodeResolver, NodeType } from './types.ts'
import { DateTimeResolver, NonNegativeIntResolver } from 'graphql-scalars'
import { GraphQLError } from 'graphql'
import { decodeGlobalId, fromGlobalId } from '../globalId.ts'
import { getUser } from '../auth/auth-context.ts'
import { userToGraphQL, deriveInitials } from '../user/user-domain.ts'
import * as UserResolvers from '../user/user-resolvers.ts'
import * as TaskResolvers from '../task/task-resolvers.ts'
import * as TaskMutations from '../task/task-mutations.ts'
import * as RoutineSlotResolvers from '../routine-slot/routine-slot-resolvers.ts'
import * as RoutineSlotMutations from '../routine-slot/routine-slot-mutations.ts'
import * as TaskCompletionResolvers from '../task-completion/task-completion-resolvers.ts'
import * as TaskCompletionMutations from '../task-completion/task-completion-mutations.ts'
import * as ScheduleResolvers from '../schedule/schedule-resolvers.ts'
import * as PushResolvers from '../push/push-resolvers.ts'
import * as PushMutations from '../push/push-mutations.ts'

const nodeResolvers: { [NodeName in NodeType]: NodeResolver<NodeName> } = {
  User: UserResolvers.resolveUserAsNode,
  Task: TaskResolvers.resolveTaskAsNode,
  RoutineSlot: RoutineSlotResolvers.resolveRoutineTaskAsNode,
  TaskCompletion: TaskCompletionResolvers.resolveTaskCompletionAsNode,
  PushSubscription: PushResolvers.resolvePushSubscriptionAsNode,
}

export const resolvers: Resolvers<Context> = {
  Query: {
    hello: () => {
      return 'world'
    },
    me: async (_, _args, context) => {
      const user = await getUser(context)
      return userToGraphQL(user)
    },
    node: async (_, { id }, context) => {
      let type: string

      try {
        type = decodeGlobalId(id).type
      } catch {
        throw new GraphQLError('Invalid node ID', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      if (type === 'DailyTaskInstance') {
        return ScheduleResolvers.resolveDailyTaskInstanceAsNode(id, context)
      }

      if (type === 'DaySectionSlots') {
        return ScheduleResolvers.resolveDaySectionSlotsAsNode(id, context)
      }

      const adapter = nodeResolvers[type as keyof typeof nodeResolvers]

      if (!adapter) {
        throw new GraphQLError(`Unknown node type: ${type}`, {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      try {
        const internalId = fromGlobalId(id, type)
        return adapter(internalId, context)
      } catch {
        throw new GraphQLError('Invalid node ID', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }
    },
    tasks: TaskResolvers.tasksResolver,
    taskCompletions: TaskCompletionResolvers.taskCompletions,
    dailyRoutine: ScheduleResolvers.dailyRoutine,
    weeklySchedule: ScheduleResolvers.weeklySchedule,
    daySectionSlots: ScheduleResolvers.daySectionSlots,
  },
  Mutation: {
    createTask: TaskMutations.createTask,
    deleteTask: TaskMutations.deleteTask,
    updateTask: TaskMutations.updateTask,
    createRoutineSlot: RoutineSlotMutations.createRoutineSlot,
    deleteRoutineSlot: RoutineSlotMutations.deleteRoutineSlot,
    moveRoutineSlot: RoutineSlotMutations.moveRoutineSlot,
    completeRoutineSlot: TaskCompletionMutations.completeRoutineSlot,
    uncompleteRoutineSlot: TaskCompletionMutations.uncompleteRoutineSlot,
    registerPushSubscription: PushMutations.registerPushSubscription,
    removePushSubscription: PushMutations.removePushSubscription,
    sendTestPush: PushMutations.sendTestPush,
  },
  User: {
    initials: ({ name }) => deriveInitials(name),
    pushSubscriptions: PushResolvers.pushSubscriptions,
    morningReminderEnabled: PushResolvers.morningReminderEnabled,
  },
  Task: {
    completions: TaskResolvers.completions,
    slots: TaskResolvers.slots,
  },
  RoutineSlot: {
    task: RoutineSlotResolvers.task,
  },
  TaskCompletion: {
    routineSlot: TaskCompletionResolvers.routineSlot,
    dailyTaskInstance: TaskCompletionResolvers.dailyTaskInstance,
  },
  DailyRoutinePayload: {
    morning: ScheduleResolvers.morning,
    midday: ScheduleResolvers.midday,
    evening: ScheduleResolvers.evening,
  },
  WeeklySchedulePayload: {
    monday: ScheduleResolvers.monday,
    tuesday: ScheduleResolvers.tuesday,
    wednesday: ScheduleResolvers.wednesday,
    thursday: ScheduleResolvers.thursday,
    friday: ScheduleResolvers.friday,
    saturday: ScheduleResolvers.saturday,
    sunday: ScheduleResolvers.sunday,
  },
  DaySchedule: {
    morning: ScheduleResolvers.dayMorning,
    midday: ScheduleResolvers.dayMidday,
    evening: ScheduleResolvers.dayEvening,
  },
  DaySectionSlots: {
    slots: ScheduleResolvers.sectionSlots,
  },
  Node: {
    __resolveType: parent => parent.__typename ?? null,
  },
  // Custom scalars
  DateTime: DateTimeResolver,
  NonNegativeInt: NonNegativeIntResolver,
}
