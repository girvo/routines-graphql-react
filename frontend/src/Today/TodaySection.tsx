import { graphql, useFragment } from 'react-relay'
import { Card } from '../primitives/layout/Card.tsx'
import { SectionHeader } from '../primitives/layout/SectionHeader.tsx'
import { TodayTaskRow } from './TodayTaskRow.tsx'
import type { TodaySection_section$key } from './__generated__/TodaySection_section.graphql.ts'
import styles from './TodaySection.module.css'

interface TodaySectionProps {
  label: string
  section: TodaySection_section$key
}

export const TodaySection = ({ label, section }: TodaySectionProps) => {
  const data = useFragment(
    graphql`
      fragment TodaySection_section on DailyTaskInstanceConnection {
        edges {
          node {
            routineSlot {
              id
            }
            completion {
              id
            }
            ...TodayTaskRow_instance
          }
        }
      }
    `,
    section,
  )

  const total = data.edges.length
  const completed = data.edges.filter((edge) => edge.node.completion !== null).length
  const progress = `${completed}/${total}`

  return (
    <Card as="section" responsive className={styles.section}>
      <div className={styles.desktopHeader}>
        <SectionHeader title={label} count={progress} dense />
      </div>
      <div className={styles.mobileHeader}>
        <span className={styles.mobileLabel}>{label}</span>
        <span className={styles.mobileCount}>{progress}</span>
      </div>
      <div className={styles.headerDivider} />
      <div className={styles.body}>
        {total === 0 && (
          <div className={styles.empty}>
            No {label.toLowerCase()} tasks scheduled
          </div>
        )}
        {data.edges.map((edge) => (
          <TodayTaskRow key={edge.node.routineSlot.id} instance={edge.node} />
        ))}
      </div>
    </Card>
  )
}
