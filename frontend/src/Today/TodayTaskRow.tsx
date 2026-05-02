import { graphql, useFragment, useMutation } from 'react-relay'
import type { RecordProxy, RecordSourceSelectorProxy } from 'relay-runtime'
import { DynamicIcon } from 'lucide-react/dynamic'
import { clsx } from 'clsx'
import { CheckBox } from '../primitives/form/CheckBox.tsx'
import { parseIconName } from '../utils/icons.ts'
import { useMutationErrorHandler } from '../relay/use-mutation-error-handler.ts'
import type { TodayTaskRow$key } from './__generated__/TodayTaskRow.graphql.ts'
import type { TodayTaskRowUpdatable$key } from './__generated__/TodayTaskRowUpdatable.graphql.ts'
import type { TodayTaskRowCompleteMutation } from './__generated__/TodayTaskRowCompleteMutation.graphql.ts'
import type { TodayTaskRowUncompleteMutation } from './__generated__/TodayTaskRowUncompleteMutation.graphql.ts'
import styles from './TodayTaskRow.module.css'

const writeCompletion = (
  store: RecordSourceSelectorProxy,
  ref: TodayTaskRowUpdatable$key,
  completion: RecordProxy | null,
) => {
  const { updatableData } = store.readUpdatableFragment<TodayTaskRowUpdatable$key>(
    graphql`
      fragment TodayTaskRowUpdatable on DailyTaskInstance @updatable {
        completion {
          id
        }
      }
    `,
    ref,
  )
  updatableData.completion = completion
}

interface TodayTaskRowProps {
  instance: TodayTaskRow$key
  updatable: TodayTaskRowUpdatable$key
}

export const TodayTaskRow = ({ instance, updatable }: TodayTaskRowProps) => {
  const data = useFragment(
    graphql`
      fragment TodayTaskRow on DailyTaskInstance {
        routineSlot {
          id
          task {
            title
            icon
          }
        }
        completion {
          id
        }
      }
    `,
    instance,
  )

  const isComplete = data.completion !== null
  const { showPayloadErrors, showError } = useMutationErrorHandler()

  const [completeRoutineSlot, completing] =
    useMutation<TodayTaskRowCompleteMutation>(graphql`
      mutation TodayTaskRowCompleteMutation($routineSlotId: ID!) {
        completeRoutineSlot(routineSlotId: $routineSlotId) {
          taskCompletionEdge {
            node {
              id
              completedAt
            }
          }
        }
      }
    `)

  const [uncompleteRoutineSlot, uncompleting] =
    useMutation<TodayTaskRowUncompleteMutation>(graphql`
      mutation TodayTaskRowUncompleteMutation($taskCompletionId: ID!) {
        uncompleteRoutineSlot(taskCompletionId: $taskCompletionId) {
          deletedId
        }
      }
    `)

  const isLoading = completing || uncompleting

  const handleToggle = (next: boolean) => {
    if (next) {
      completeRoutineSlot({
        variables: { routineSlotId: data.routineSlot.id },
        optimisticUpdater: (store) => {
          const optimisticId = `client:optimistic-completion:${data.routineSlot.id}`
          const completion = store.create(optimisticId, 'TaskCompletion')
          completion.setValue(optimisticId, 'id')
          writeCompletion(store, data, completion)
        },
        updater: (store, response) => {
          const id = response?.completeRoutineSlot?.taskCompletionEdge.node.id
          if (!id) return
          const completion = store.get(id)
          if (!completion) return
          writeCompletion(store, data, completion)
        },
        onCompleted: (_response, errors) => {
          showPayloadErrors(errors)
        },
        onError: showError,
      })
      return
    }
    if (!data.completion) return
    uncompleteRoutineSlot({
      variables: { taskCompletionId: data.completion.id },
      optimisticUpdater: (store) => {
        writeCompletion(store, data, null)
      },
      updater: (store) => {
        writeCompletion(store, data, null)
      },
      onCompleted: (_response, errors) => {
        showPayloadErrors(errors)
      },
      onError: showError,
    })
  }

  return (
    <CheckBox
      checked={isComplete}
      onChange={handleToggle}
      disabled={isLoading}
      className={styles.row}
      aria-label={data.routineSlot.task.title}
    >
      <span className={styles.iconWrap} aria-hidden>
        <DynamicIcon
          name={parseIconName(data.routineSlot.task.icon)}
          className={styles.icon}
        />
      </span>
      <span className={clsx(styles.label, isComplete && styles.labelComplete)}>
        {data.routineSlot.task.title}
      </span>
    </CheckBox>
  )
}
