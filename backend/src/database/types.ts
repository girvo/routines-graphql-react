import type { ColumnType, Generated } from 'kysely'
import type { DayOfWeek, DaySection } from '@my-routines/shared'

export type { DayOfWeek, DaySection }

export interface Database {
  users: UsersTable
  refresh_tokens: RefreshTokensTable
  tasks: TasksTable
  routine_slots: RoutineSlotsTable
  task_completions: TaskCompletionsTable
  push_subscriptions: PushSubscriptionsTable
  morning_reminder_deliveries: MorningReminderDeliveriesTable
}

export interface UsersTable {
  id: Generated<number>
  email: string
  name: string
  password_hash: string
  created_at: ColumnType<string, string | undefined, never>
  updated_at: ColumnType<string | null, string | undefined, string>
  last_logged_in: string | null
}

export interface RefreshTokensTable {
  id: Generated<number>
  user_id: number
  token_hash: string
  expires_at: string
  created_at: ColumnType<string, string | undefined, never>
  revoked_at: string | null
  user_agent: string | null
  ip_address: string | null
}

export interface TasksTable {
  id: Generated<number>
  user_id: number
  title: string
  icon: string | null
  created_at: ColumnType<string, string | undefined, never>
  updated_at: ColumnType<string | null, string | undefined, string>
  deleted_at: string | null
}

export interface RoutineSlotsTable {
  id: Generated<number>
  user_id: number
  task_id: number
  day_of_week: DayOfWeek
  section: DaySection
  /** Dense 0..n-1 within live (user_id, day_of_week, section); see the migration. */
  position: Generated<number>
  created_at: ColumnType<string, string | undefined, string>
  deleted_at: string | null
}

export interface TaskCompletionsTable {
  id: Generated<number>
  routine_slot_id: number
  user_id: number
  completed_at: ColumnType<string, string | undefined, never>
  created_at: ColumnType<string, string | undefined, never>
}

export interface PushSubscriptionsTable {
  id: Generated<number>
  user_id: number
  endpoint: string
  p256dh_key: string
  auth_key: string
  platform: string | null
  user_agent: string | null
  created_at: ColumnType<string, string | undefined, never>
  last_seen_at: string | null
}

export type MorningReminderStatus =
  /** Written before the sends start; see `claimDelivery` in morning-reminder.ts. */
  | 'PENDING'
  | 'SENT'
  | 'SKIPPED_NO_SLOTS'
  | 'SKIPPED_ALREADY_COMPLETE'
  | 'SKIPPED_NO_SUBSCRIPTION'
  | 'FAILED'

export interface MorningReminderDeliveriesTable {
  id: Generated<number>
  user_id: number
  day_key: string
  status: MorningReminderStatus
  subscriptions_sent: number
  error: string | null
  attempts: Generated<number>
  created_at: ColumnType<string, string | undefined, never>
}
