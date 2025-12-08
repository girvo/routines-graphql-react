# TODO: My Routines Implementation

## Missing Major Features

(None remaining - all major features implemented!)

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
- [x] Daily Routine query (dailyRoutine) - shows actual instances for a specific date with completion status
- [x] Weekly Schedule query (weeklySchedule) - shows the template/plan for each day of the week (no completions)
