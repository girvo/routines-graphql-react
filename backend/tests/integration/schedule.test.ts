import { assert, describe, it, expect, beforeAll, beforeEach } from 'vitest'
import { clearAllTables } from '../helpers/db.ts'
import { createTestUser } from '../helpers/auth.ts'
import { createTask } from '../helpers/tasks.ts'
import {
  createTestApp,
  executeGraphQL,
  type YogaApp,
} from '../helpers/graphql.ts'
import { graphql } from '../gql/gql.ts'
import { createRoutineSlot } from '../helpers/routine-slot.ts'

let yoga: YogaApp

beforeAll(async () => {
  const { yoga: testYoga } = await createTestApp()
  yoga = testYoga
})

beforeEach(async () => {
  await clearAllTables()
})

describe('dailyRoutine query', () => {
  it('can query daily routine for a specific day with morning, midday, and evening sections', async () => {
    const { userToken } = await createTestUser()

    const morningTask = await createTask({
      title: 'Morning Exercise',
      yoga,
      userToken,
    })
    const middayTask = await createTask({
      title: 'Lunch Prep',
      yoga,
      userToken,
    })
    const eveningTask = await createTask({
      title: 'Evening Reading',
      yoga,
      userToken,
    })

    assert(
      morningTask.data?.createTask.taskEdge.node !== undefined,
      'morning task created',
    )
    assert(
      middayTask.data?.createTask.taskEdge.node !== undefined,
      'midday task created',
    )
    assert(
      eveningTask.data?.createTask.taskEdge.node !== undefined,
      'evening task created',
    )

    await createRoutineSlot({
      input: {
        taskId: morningTask.data.createTask.taskEdge.node.id,
        dayOfWeek: 'MONDAY',
        section: 'MORNING',
      },
      yoga,
      userToken,
    })

    await createRoutineSlot({
      input: {
        taskId: middayTask.data.createTask.taskEdge.node.id,
        dayOfWeek: 'MONDAY',
        section: 'MIDDAY',
      },
      yoga,
      userToken,
    })

    await createRoutineSlot({
      input: {
        taskId: eveningTask.data.createTask.taskEdge.node.id,
        dayOfWeek: 'MONDAY',
        section: 'EVENING',
      },
      yoga,
      userToken,
    })

    const result = await executeGraphQL(
      graphql(`
        query DailyRoutineWithSections {
          dailyRoutine {
            date
            dayOfWeek
            morning {
              edges {
                node {
                  routineSlot {
                    id
                    dayOfWeek
                    section
                    task {
                      title
                    }
                  }
                  completion {
                    id
                  }
                }
              }
            }
            midday {
              edges {
                node {
                  routineSlot {
                    id
                    dayOfWeek
                    section
                    task {
                      title
                    }
                  }
                  completion {
                    id
                  }
                }
              }
            }
            evening {
              edges {
                node {
                  routineSlot {
                    id
                    dayOfWeek
                    section
                    task {
                      title
                    }
                  }
                  completion {
                    id
                  }
                }
              }
            }
          }
        }
      `),
      {},
      { yoga, userToken },
    )

    expect(result.errors).toBeUndefined()
    const routine = result.data?.dailyRoutine
    assert(routine !== undefined, 'routine returned')

    expect(routine.morning.edges.length).toBe(1)
    expect(routine.morning.edges[0].node.routineSlot.task.title).toBe(
      'Morning Exercise',
    )
    expect(routine.morning.edges[0].node.routineSlot.section).toBe('MORNING')
    expect(routine.morning.edges[0].node.completion).toBeNull()

    expect(routine.midday.edges.length).toBe(1)
    expect(routine.midday.edges[0].node.routineSlot.task.title).toBe(
      'Lunch Prep',
    )
    expect(routine.midday.edges[0].node.routineSlot.section).toBe('MIDDAY')
    expect(routine.midday.edges[0].node.completion).toBeNull()

    expect(routine.evening.edges.length).toBe(1)
    expect(routine.evening.edges[0].node.routineSlot.task.title).toBe(
      'Evening Reading',
    )
    expect(routine.evening.edges[0].node.routineSlot.section).toBe('EVENING')
    expect(routine.evening.edges[0].node.completion).toBeNull()
  })

  it('returns only slots for the specified day of week', async () => {
    const { userToken } = await createTestUser()

    const task = await createTask({
      title: 'Monday Task',
      yoga,
      userToken,
    })

    assert(task.data?.createTask.taskEdge.node !== undefined, 'task created')

    await createRoutineSlot({
      input: {
        taskId: task.data.createTask.taskEdge.node.id,
        dayOfWeek: 'MONDAY',
        section: 'MORNING',
      },
      yoga,
      userToken,
    })

    await createRoutineSlot({
      input: {
        taskId: task.data.createTask.taskEdge.node.id,
        dayOfWeek: 'TUESDAY',
        section: 'MORNING',
      },
      yoga,
      userToken,
    })

    const result = await executeGraphQL(
      graphql(`
        query DailyRoutineByDayOfWeek($date: DateTime) {
          dailyRoutine(date: $date) {
            dayOfWeek
            morning {
              edges {
                node {
                  routineSlot {
                    dayOfWeek
                  }
                }
              }
            }
          }
        }
      `),
      {},
      { yoga, userToken },
    )

    expect(result.errors).toBeUndefined()
    const routine = result.data?.dailyRoutine
    assert(routine !== undefined, 'routine returned')

    const dayOfWeek = routine.dayOfWeek
    routine.morning.edges.forEach(edge => {
      expect(edge.node.routineSlot.dayOfWeek).toBe(dayOfWeek)
    })
  })
})

describe('weeklySchedule query', () => {
  it('can query weekly schedule with all days and sections', async () => {
    const { userToken } = await createTestUser()

    const mondayTask = await createTask({
      title: 'Monday Task',
      yoga,
      userToken,
    })
    const tuesdayTask = await createTask({
      title: 'Tuesday Task',
      yoga,
      userToken,
    })

    assert(
      mondayTask.data?.createTask.taskEdge.node !== undefined,
      'monday task created',
    )
    assert(
      tuesdayTask.data?.createTask.taskEdge.node !== undefined,
      'tuesday task created',
    )

    await createRoutineSlot({
      input: {
        taskId: mondayTask.data.createTask.taskEdge.node.id,
        dayOfWeek: 'MONDAY',
        section: 'MORNING',
      },
      yoga,
      userToken,
    })

    await createRoutineSlot({
      input: {
        taskId: tuesdayTask.data.createTask.taskEdge.node.id,
        dayOfWeek: 'TUESDAY',
        section: 'EVENING',
      },
      yoga,
      userToken,
    })

    const result = await executeGraphQL(
      graphql(`
        query WeeklySchedule {
          weeklySchedule {
            monday {
              dayOfWeek
              morning {
                edges {
                  node {
                    id
                    dayOfWeek
                    section
                    task {
                      title
                    }
                  }
                }
              }
              midday {
                edges {
                  node {
                    id
                  }
                }
              }
              evening {
                edges {
                  node {
                    id
                  }
                }
              }
            }
            tuesday {
              dayOfWeek
              morning {
                edges {
                  node {
                    id
                  }
                }
              }
              midday {
                edges {
                  node {
                    id
                  }
                }
              }
              evening {
                edges {
                  node {
                    id
                    dayOfWeek
                    section
                    task {
                      title
                    }
                  }
                }
              }
            }
          }
        }
      `),
      {},
      { yoga, userToken },
    )

    expect(result.errors).toBeUndefined()
    const schedule = result.data?.weeklySchedule
    assert(schedule !== undefined, 'schedule returned')

    expect(schedule.monday.dayOfWeek).toBe('MONDAY')
    expect(schedule.monday.morning.edges.length).toBe(1)
    expect(schedule.monday.morning.edges[0].node.task.title).toBe('Monday Task')
    expect(schedule.monday.morning.edges[0].node.section).toBe('MORNING')
    expect(schedule.monday.midday.edges.length).toBe(0)
    expect(schedule.monday.evening.edges.length).toBe(0)

    expect(schedule.tuesday.dayOfWeek).toBe('TUESDAY')
    expect(schedule.tuesday.morning.edges.length).toBe(0)
    expect(schedule.tuesday.midday.edges.length).toBe(0)
    expect(schedule.tuesday.evening.edges.length).toBe(1)
    expect(schedule.tuesday.evening.edges[0].node.task.title).toBe('Tuesday Task')
    expect(schedule.tuesday.evening.edges[0].node.section).toBe('EVENING')
  })
})
