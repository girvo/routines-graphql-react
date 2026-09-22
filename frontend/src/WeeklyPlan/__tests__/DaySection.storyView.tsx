import { Suspense, useState } from 'react'
import {
  graphql,
  RelayEnvironmentProvider,
  useLazyLoadQuery,
} from 'react-relay'
import type { MockEnvironment } from 'relay-test-utils'
import type { ComponentType } from 'react'

import { DaySection } from '../DaySection'
import { ToastProvider } from '../../toast/ToastProvider'
import type { DaySectionPairStoryQuery } from './__generated__/DaySectionPairStoryQuery.graphql'
import type { DaySectionStoryQuery } from './__generated__/DaySectionStoryQuery.graphql'

const DaySectionStoryInner = () => {
  const data = useLazyLoadQuery<DaySectionStoryQuery>(
    graphql`
      query DaySectionStoryQuery @relay_test_operation {
        daySectionSlots(dayOfWeek: MONDAY, section: MORNING) {
          ...DaySection_section
        }
      }
    `,
    {},
  )

  return (
    <DaySection
      label="Morning"
      section={data.daySectionSlots}
      dayOfWeek="MONDAY"
      daySection="MORNING"
      queryRef={null}
      onButtonHover={() => {}}
    />
  )
}

export const DaySectionPairStoryInner = () => {
  const data = useLazyLoadQuery<DaySectionPairStoryQuery>(
    graphql`
      query DaySectionPairStoryQuery @relay_test_operation {
        morning: daySectionSlots(dayOfWeek: MONDAY, section: MORNING) {
          ...DaySection_section
        }
        midday: daySectionSlots(dayOfWeek: MONDAY, section: MIDDAY) {
          ...DaySection_section
        }
      }
    `,
    {},
  )

  return (
    <>
      <DaySection
        label="Morning"
        section={data.morning}
        dayOfWeek="MONDAY"
        daySection="MORNING"
        queryRef={null}
        onButtonHover={() => {}}
      />
      <DaySection
        label="Midday"
        section={data.midday}
        dayOfWeek="MONDAY"
        daySection="MIDDAY"
        queryRef={null}
        onButtonHover={() => {}}
      />
    </>
  )
}

export const DaySectionStoryView = ({
  createReadAndMoves,
  Inner = DaySectionStoryInner,
}: {
  createReadAndMoves: () => MockEnvironment
  Inner?: ComponentType
}) => {
  const [{ environment }] = useState(() => ({
    environment: createReadAndMoves(),
  }))

  return (
    <RelayEnvironmentProvider environment={environment}>
      <ToastProvider>
        <Suspense fallback="Loading...">
          <Inner />
        </Suspense>
      </ToastProvider>
    </RelayEnvironmentProvider>
  )
}
