import { beforeAll, beforeEach, expect, it } from 'vitest'
import { db } from '../../src/database/index.ts'
import { fromGlobalId, type GlobalId } from '../../src/globalId.ts'
import { up } from '../../migrations/20260925T164231395_repair_slots_of_deleted_tasks.ts'
import { clearAllTables } from '../helpers/db.ts'
import { createTestUser } from '../helpers/auth.ts'
import { createTask } from '../helpers/tasks.ts'
import { createRoutineSlot } from '../helpers/routine-slot.ts'
import {
  createTestApp,
  executeGraphQL,
  type YogaApp,
} from '../helpers/graphql.ts'
import { graphql } from '../gql/gql.ts'

let yoga: YogaApp

beforeAll(async () => {
  yoga = (await createTestApp()).yoga
})

beforeEach(async () => {
  await clearAllTables()
})

const MondayMorningQuery = graphql(`
  query RepairedMondayMorning {
    daySectionSlots(dayOfWeek: MONDAY, section: MORNING) {
      slots(first: 100) {
        edges {
          node {
            id
            position
            task {
              id
            }
          }
        }
      }
    }
  }
`)

const mondayMorningSlot = async (taskId: GlobalId, userToken: string) => {
  const created = await createRoutineSlot({
    input: { taskId, dayOfWeek: 'MONDAY', section: 'MORNING' },
    yoga,
    userToken,
  })
  return created.data!.createRoutineSlot!.routineSlotEdge.node.id
}

const softDeleteTaskOnly = (taskId: GlobalId) =>
  db
    .updateTable('tasks')
    .set({ deleted_at: new Date().toISOString() })
    .where('id', '=', fromGlobalId(taskId, 'Task'))
    .execute()

it('retires slots left live by an already-deleted task and re-densifies positions', async () => {
  const { userToken } = await createTestUser()
  const orphaned = (await createTask({ title: 'Orphaned', yoga, userToken }))
    .data!.createTask!.taskEdge.node.id
  const survivor = (await createTask({ title: 'Survivor', yoga, userToken }))
    .data!.createTask!.taskEdge.node.id

  await mondayMorningSlot(orphaned, userToken)
  const survivorSlot = await mondayMorningSlot(survivor, userToken)
  await softDeleteTaskOnly(orphaned)

  const broken = await executeGraphQL(
    MondayMorningQuery,
    {},
    { yoga, userToken },
  )
  expect(broken.errors?.[0]?.message).toBe('Task not found')

  await up(db)

  const repaired = await executeGraphQL(
    MondayMorningQuery,
    {},
    { yoga, userToken },
  )
  expect(repaired.errors).toBeUndefined()
  expect(
    repaired.data?.daySectionSlots.slots.edges.map(edge => edge.node),
  ).toEqual([{ id: survivorSlot, position: 0, task: { id: survivor } }])
})
