import type { Context } from '../graphql/context.ts'
import type { NodeResolver } from '../graphql/types.ts'
import type { UserResolvers } from '../graphql/resolver-types.ts'
import { assertAuthenticated } from '../graphql/context.ts'
import { fromGlobalId } from '../globalId.ts'
import { tableToDomain, pushSubscriptionToGraphQL } from './push-domain.ts'

export const resolvePushSubscriptionAsNode: NodeResolver<
  'PushSubscription'
> = async (id, context) => {
  assertAuthenticated(context)

  const row = await context.pushRepo.findByIdAndUserId(
    id,
    context.currentUser.id,
  )

  if (!row) {
    return null
  }

  return pushSubscriptionToGraphQL(tableToDomain(row))
}

export const pushSubscriptions: UserResolvers<Context>['pushSubscriptions'] =
  async (parent, _args, context) => {
    const userId = fromGlobalId(parent.id, 'User')
    const rows = await context.pushRepo.findByUserId(userId)

    return rows.map(tableToDomain).map(pushSubscriptionToGraphQL)
  }

export const morningReminderEnabled: UserResolvers<Context>['morningReminderEnabled'] =
  async (parent, _args, context) => {
    const userId = fromGlobalId(parent.id, 'User')
    const rows = await context.pushRepo.findByUserId(userId)

    return rows.length > 0
  }
