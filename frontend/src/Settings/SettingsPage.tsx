import type { SimpleEntryPointProps } from '@loop-payments/react-router-relay'
import { graphql, usePreloadedQuery } from 'react-relay'
import { Card, CardBody } from '../primitives/layout/Card.tsx'
import { usePageHeader } from '../utils/page-header.ts'
import { NotificationSettings } from './NotificationSettings.tsx'
import type { SettingsPageQuery } from './__generated__/SettingsPageQuery.graphql.ts'
import styles from './SettingsPage.module.css'

type Props = SimpleEntryPointProps<{ settingsPageQuery: SettingsPageQuery }>

const SettingsPage = ({ queries }: Props) => {
  const data = usePreloadedQuery<SettingsPageQuery>(
    graphql`
      query SettingsPageQuery {
        me {
          id
          ...NotificationSettings_me
        }
      }
    `,
    queries.settingsPageQuery,
  )

  usePageHeader({ title: 'Settings' })

  return (
    <div className={styles.page}>
      <Card responsive className={styles.card}>
        <CardBody className={styles.cardBody}>
          <NotificationSettings me={data.me} />
        </CardBody>
      </Card>
    </div>
  )
}

export default SettingsPage
