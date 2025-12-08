# TODO: My Routines Implementation

## Missing Major Features

### 2. Weekly Schedule Query (`weeklySchedule`)

**Status:** Not implemented
**Priority:** High

**What it does:**

- Returns the complete weekly schedule template (not tied to a specific week)
- Shows which routine slots are scheduled for each day of the week
- Each day has morning, midday, and evening sections

**Implementation needed:**

- [ ] Implement `weeklySchedule` query resolver in `backend/src/schedule/schedule-resolvers.ts`
  - Return WeeklySchedulePayload with all seven days
- [ ] Implement DaySchedule resolver for each day (Monday through Sunday)
  - [ ] `morning` - fetch routine slots for MORNING section for that day
  - [ ] `midday` - fetch routine slots for MIDDAY section for that day
  - [ ] `evening` - fetch routine slots for EVENING section for that day
- [ ] Wire up resolvers in `backend/src/graphql/resolvers.ts`
- [ ] Add pagination support for RoutineSlotConnection
- [ ] Write tests

## Implementation Notes

### Daily Routine vs Weekly Schedule

- **Daily Routine**: Shows actual instances for a specific date with completion status
- **Weekly Schedule**: Shows the template/plan for each day of the week (no completions)

### Database Queries Needed

For `dailyRoutine`:

- Query RoutineSlots by dayOfWeek and section
- Query TaskCompletions by date range and routineSlotId
- Join the two to create DailyTaskInstance objects

For `weeklySchedule`:

- Query RoutineSlots grouped by dayOfWeek and section
- No need to query TaskCompletions (template only)

### Pagination

Both features require proper connection/edge implementations:

- DailyTaskInstanceConnection (for dailyRoutine)
- RoutineSlotConnection (for weeklySchedule - already used elsewhere)

## Completed Features ✓

- [x] Task CRUD (create, update, delete)
- [x] Task queries (tasks list, Task.slots, Task.completions)
- [x] Routine slot management (create, delete)
- [x] Task completion/uncompletion
- [x] User authentication (me query)
- [x] Node interface and resolution
- [x] Field resolvers for Task, RoutineSlot, TaskCompletion
