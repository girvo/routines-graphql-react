import { graphql, useFragment, useMutation } from 'react-relay'
import { DynamicIcon } from 'lucide-react/dynamic'
import { clsx } from 'clsx'
import { CheckBox } from '../primitives/form/CheckBox.tsx'
import { parseIconName } from '../utils/icons.ts'
import { useMutationErrorHandler } from '../relay/use-mutation-error-handler.ts'
import type { TodayTaskRow$key } from './__generated__/TodayTaskRow.graphql.ts'
import type { TodayTaskRowCompleteMutation } from './__generated__/TodayTaskRowCompleteMutation.graphql.ts'
import type { TodayTaskRowUncompleteMutation } from './__generated__/TodayTaskRowUncompleteMutation.graphql.ts'
import styles from './TodayTaskRow.module.css'

interface TodayTaskRowProps {
  instance: TodayTaskRow$key
}

export const TodayTaskRow = ({ instance }: TodayTaskRowProps) => {
  const data = useFragment(
    graphql`
      fragment TodayTaskRow on DailyTaskInstance {
        id
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
      mutation TodayTaskRowCompleteMutation($dailyTaskInstanceId: ID!) {
        completeRoutineSlot(dailyTaskInstanceId: $dailyTaskInstanceId) {
          taskCompletionEdge {
            node {
              id
              completedAt
              dailyTaskInstance {
                id
                completion {
                  id
                }
              }
            }
          }
        }
      }
    `)

  const [uncompleteRoutineSlot, uncompleting] =
    useMutation<TodayTaskRowUncompleteMutation>(graphql`
      mutation TodayTaskRowUncompleteMutation($dailyTaskInstanceId: ID!) {
        uncompleteRoutineSlot(dailyTaskInstanceId: $dailyTaskInstanceId) {
          deletedId @deleteRecord
          dailyTaskInstance {
            id
          }
        }
      }
    `)

  const isLoading = completing || uncompleting

  const handleToggle = (next: boolean) => {
    if (next) {
      const optimisticCompletionId = `client:optimistic-completion:${data.id}`
      completeRoutineSlot({
        variables: { dailyTaskInstanceId: data.id },
        optimisticResponse: {
          completeRoutineSlot: {
            taskCompletionEdge: {
              node: {
                id: optimisticCompletionId,
                completedAt: new Date().toISOString(),
                dailyTaskInstance: {
                  id: data.id,
                  completion: { id: optimisticCompletionId },
                },
              },
            },
          },
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
      variables: { dailyTaskInstanceId: data.id },
      optimisticResponse: {
        uncompleteRoutineSlot: {
          deletedId: data.completion.id,
          dailyTaskInstance: {
            id: data.id,
          },
        },
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
