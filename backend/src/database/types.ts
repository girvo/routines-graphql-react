import type { ColumnType, Generated } from 'kysely'

export interface Database {
  users: UsersTable
  refresh_tokens: RefreshTokensTable
  tasks: TasksTable
  routine_slots: RoutineSlotsTable
  task_completions: TaskCompletionsTable
}

export interface UsersTable {
  id: Generated<number>
  email: string
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
  created_at: ColumnType<string, string | undefined, never>
  updated_at: ColumnType<string | null, string | undefined, string>
  deleted_at: string | null
}

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export type DaySection = 'MORNING' | 'MIDDAY' | 'EVENING'

export interface RoutineSlotsTable {
  id: Generated<number>
  user_id: number
  task_id: number
  day_of_week: DayOfWeek
  section: DaySection
  created_at: ColumnType<string, string | undefined, never>
  deleted_at: string | null
}

export interface TaskCompletionsTable {
  id: Generated<number>
  routine_slot_id: number
  user_id: number
  completed_at: ColumnType<string, string | undefined, never>
  created_at: ColumnType<string, string | undefined, never>
}
