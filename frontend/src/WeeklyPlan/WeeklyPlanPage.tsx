import { useState } from 'react'
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import type { WeeklyPlanPageQuery } from './__generated__/WeeklyPlanPageQuery.graphql'

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

type Day = (typeof DAYS)[number]

export interface WeeklyPlanPageProps {
  queries: {
    weeklyPlanPageQuery: PreloadedQuery<WeeklyPlanPageQuery>
  }
}

const WeeklyPlanPage = ({ queries }: WeeklyPlanPageProps) => {
  const [selectedDay, setSelectedDay] = useState<Day>('Monday')

  const data = usePreloadedQuery<WeeklyPlanPageQuery>(
    graphql`
      query WeeklyPlanPageQuery {
        weeklySchedule {
          monday {
            dayOfWeek
            morning(first: 100) {
              edges {
                node {
                  id
                  createdAt
                  section
                  task {
                    ...TaskDisplay
                  }
                }
              }
            }
          }
        }
      }
    `,
    queries.weeklyPlanPageQuery,
  )

  console.log(data)

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
      <div className="flex items-center justify-between border-b border-base-300 p-4 md:hidden">
        <button className="btn btn-ghost btn-sm" onClick={goToPreviousDay}>
          ◀
        </button>
        <span className="font-bold text-lg">{selectedDay}</span>
        <button className="btn btn-ghost btn-sm" onClick={goToNextDay}>
          ▶
        </button>
      </div>

      {/* Desktop: Vertical tabs sidebar */}
      <ul className="menu hidden w-48 border-r border-base-300 md:block">
        {DAYS.map((day) => (
          <li key={day}>
            <button
              className={selectedDay === day ? 'font-bold' : ''}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          </li>
        ))}
      </ul>

      {/* Content area */}
      <div className="flex-1 p-4 md:p-6">
        <h1 className="hidden text-2xl font-bold border-b border-base-300 pb-4 md:block">
          {selectedDay}
        </h1>
      </div>
    </div>
  )
}

export default WeeklyPlanPage
