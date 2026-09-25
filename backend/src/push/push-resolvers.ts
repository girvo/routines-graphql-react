import type { Context } from '../graphql/context.ts'
import type { NodeLoader } from '../graphql/types.ts'
import type { UserResolvers } from '../graphql/resolver-types.ts'
import { assertAuthenticated } from '../graphql/context.ts'
import { tableToDomain } from './push-domain.ts'

export const resolvePushSubscriptionAsNode: NodeLoader<
  'PushSubscription',
  number
> = async (id, context) => {
  assertAuthenticated(context)

  const row = await context.pushRepo.findByIdAndUserId(
    id,
    context.currentUser.id,
  )

  if (!row) {
    return null
  }

  return tableToDomain(row)
}

export const pushSubscriptions: UserResolvers<Context>['pushSubscriptions'] =
  async (parent, _args, context) => {
    const userId = parent.id
    const rows = await context.pushRepo.findByUserId(userId)

    return rows.map(tableToDomain)
  }

export const morningReminderEnabled: UserResolvers<Context>['morningReminderEnabled'] =
  async (parent, _args, context) => {
    const userId = parent.id
    const rows = await context.pushRepo.findByUserId(userId)

    return rows.length > 0
  }
