import type { Resolvers } from './resolver-types.ts'
import type { Context } from './context.ts'
import type { NodeLoader, NodeResolver, NodeType } from './types.ts'
import { DateTimeResolver, NonNegativeIntResolver } from 'graphql-scalars'
import { GraphQLError } from 'graphql'
import {
  decodeGlobalId,
  fromGlobalId,
  toGlobalId,
  type GlobalId,
} from '../globalId.ts'
import {
  decodeDailyTaskInstanceId,
  decodeDaySectionSlotsId,
  encodeDailyTaskInstanceId,
  encodeDaySectionSlotsId,
} from '../schedule/schedule-domain.ts'
import { getUser } from '../auth/auth-context.ts'
import { deriveInitials } from '../user/user-domain.ts'
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

const invalidNodeId = () =>
  new GraphQLError('Invalid node ID', {
    extensions: { code: 'BAD_USER_INPUT' },
  })

const decodedWith =
  <T extends NodeType, Key>(
    type: T,
    decode: (globalId: GlobalId) => Key,
    load: NodeLoader<T, Key>,
  ): NodeResolver<T> =>
  async (globalId, context) => {
    let key: Key
    try {
      key = decode(globalId)
    } catch {
      throw invalidNodeId()
    }
    const node = await load(key, context)
    return node && { ...node, __typename: type }
  }

const integerIdNode = <T extends NodeType>(
  type: T,
  load: NodeLoader<T, number>,
): NodeResolver<T> =>
  decodedWith(type, globalId => fromGlobalId(globalId, type), load)

const nodeResolvers: { [NodeName in NodeType]: NodeResolver<NodeName> } = {
  User: integerIdNode('User', UserResolvers.resolveUserAsNode),
  Task: integerIdNode('Task', TaskResolvers.resolveTaskAsNode),
  RoutineSlot: integerIdNode(
    'RoutineSlot',
    RoutineSlotResolvers.resolveRoutineTaskAsNode,
  ),
  TaskCompletion: integerIdNode(
    'TaskCompletion',
    TaskCompletionResolvers.resolveTaskCompletionAsNode,
  ),
  PushSubscription: integerIdNode(
    'PushSubscription',
    PushResolvers.resolvePushSubscriptionAsNode,
  ),
  DailyTaskInstance: decodedWith(
    'DailyTaskInstance',
    decodeDailyTaskInstanceId,
    ScheduleResolvers.resolveDailyTaskInstanceAsNode,
  ),
  DaySectionSlots: decodedWith(
    'DaySectionSlots',
    decodeDaySectionSlotsId,
    ScheduleResolvers.resolveDaySectionSlotsAsNode,
  ),
}

const isNodeType = (type: string): type is NodeType =>
  Object.hasOwn(nodeResolvers, type)

export const resolvers: Resolvers<Context> = {
  Query: {
    hello: () => {
      return 'world'
    },
    me: (_, _args, context) => getUser(context),
    node: (_, { id }, context) => {
      let type: string
      try {
        type = decodeGlobalId(id).type
      } catch {
        throw invalidNodeId()
      }

      if (!isNodeType(type)) {
        throw new GraphQLError(`Unknown node type: ${type}`, {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      return nodeResolvers[type](id, context)
    },
    tasks: TaskResolvers.tasksResolver,
    taskCompletions: TaskCompletionResolvers.taskCompletions,
    dailyRoutine: ScheduleResolvers.dailyRoutine,
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
    id: user => toGlobalId('User', user.id),
    initials: ({ name }) => deriveInitials(name),
    pushSubscriptions: PushResolvers.pushSubscriptions,
    morningReminderEnabled: PushResolvers.morningReminderEnabled,
  },
  Task: {
    id: task => toGlobalId('Task', task.id),
    completions: TaskResolvers.completions,
    slots: TaskResolvers.slots,
  },
  RoutineSlot: {
    id: slot => toGlobalId('RoutineSlot', slot.id),
    task: RoutineSlotResolvers.task,
  },
  TaskCompletion: {
    id: completion => toGlobalId('TaskCompletion', completion.id),
    routineSlot: TaskCompletionResolvers.routineSlot,
    dailyTaskInstance: TaskCompletionResolvers.dailyTaskInstance,
  },
  DailyRoutinePayload: {
    morning: ScheduleResolvers.morning,
    midday: ScheduleResolvers.midday,
    evening: ScheduleResolvers.evening,
  },
  PushSubscription: {
    id: subscription => toGlobalId('PushSubscription', subscription.id),
  },
  DailyTaskInstance: {
    id: instance =>
      encodeDailyTaskInstanceId(instance.routineSlot.id, instance.date),
  },
  DaySectionSlots: {
    id: container =>
      encodeDaySectionSlotsId(container.dayOfWeek, container.section),
    slots: ScheduleResolvers.sectionSlots,
  },
  Node: {
    __resolveType: parent => parent.__typename,
  },
  // Custom scalars
  DateTime: DateTimeResolver,
  NonNegativeInt: NonNegativeIntResolver,
}
