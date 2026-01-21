import { useState } from 'react'
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import type { WeeklyPlanPageQuery } from './__generated__/WeeklyPlanPageQuery.graphql'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { capitalise } from '../utils/text'
import { WeeklyPlanDay } from './WeeklyPlanDay'

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

type Day = (typeof DAYS)[number]

export interface WeeklyPlanPageProps {
  queries: {
    weeklyPlanPageQuery: PreloadedQuery<WeeklyPlanPageQuery>
  }
}

const WeeklyPlanPage = ({ queries }: WeeklyPlanPageProps) => {
  const [selectedDay, setSelectedDay] = useState<Day>('monday')

  const schedule = usePreloadedQuery<WeeklyPlanPageQuery>(
    graphql`
      query WeeklyPlanPageQuery {
        weeklySchedule {
          monday {
            ...WeeklyPlanDay
          }
          tuesday {
            ...WeeklyPlanDay
          }
          wednesday {
            ...WeeklyPlanDay
          }
          thursday {
            ...WeeklyPlanDay
          }
          friday {
            ...WeeklyPlanDay
          }
          saturday {
            ...WeeklyPlanDay
          }
          sunday {
            ...WeeklyPlanDay
          }
        }
      }
    `,
    queries.weeklyPlanPageQuery,
  )

  const currentIndex = DAYS.indexOf(selectedDay)

  const goToPreviousDay = () => {
    const prevIndex = currentIndex === 0 ? DAYS.length - 1 : currentIndex - 1
    setSelectedDay(DAYS[prevIndex])
  }

  const goToNextDay = () => {
    const nextIndex = currentIndex === DAYS.length - 1 ? 0 : currentIndex + 1
    setSelectedDay(DAYS[nextIndex])
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* Mobile: Day selector header */}
      <div className="border-base-300 flex items-center justify-between border-b p-4 md:hidden">
        <button className="btn btn-ghost btn-sm" onClick={goToPreviousDay}>
          <ChevronLeft />
        </button>
        <span className="text-lg font-bold">{capitalise(selectedDay)}</span>
        <button className="btn btn-ghost btn-sm" onClick={goToNextDay}>
          <ChevronRight />
        </button>
      </div>

      {/* Desktop: Vertical tabs sidebar */}
      <ul className="menu border-base-300 hidden w-48 border-r md:block">
        {DAYS.map(day => (
          <li key={day}>
            <button
              className={selectedDay === day ? 'font-bold' : ''}
              onClick={() => setSelectedDay(day)}
            >
              {capitalise(day)}
            </button>
          </li>
        ))}
      </ul>

      {/* Content area */}
      <WeeklyPlanDay day={schedule.weeklySchedule[selectedDay]} />
    </div>
  )
}

export default WeeklyPlanPage
