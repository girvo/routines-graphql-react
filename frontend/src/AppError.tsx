import { useRouteError } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { clsx } from 'clsx'
import { Card } from './primitives/layout/Card.tsx'
import { Title } from './primitives/text/Title.tsx'
import { Body } from './primitives/text/Body.tsx'
import styles from './AppError.module.css'

export const AppError = ({ error }: { error?: Error }) => {
  const showDetail = Boolean(error) && import.meta.env.DEV
  return (
    <div className={styles.page}>
      <Card className={clsx(styles.card, showDetail && styles.cardWide)}>
        <AlertTriangle className={styles.icon} aria-hidden />
        <Title size="md" className={styles.title}>
          Something Went Wrong
        </Title>
        <Body className={styles.body}>
          An unexpected error occurred. Please try refreshing the page.
        </Body>
        {showDetail && error && (
          <div className={styles.detail}>
            <span className={styles.detailTitle}>
              {error.name}: {error.message}
            </span>
            {error.stack && <pre className={styles.stack}>{error.stack}</pre>}
          </div>
        )}
      </Card>
    </div>
  )
}

export const RouteErrorBoundary = () => {
  const routeError = useRouteError()
  const error =
    routeError instanceof Error ? routeError : new Error(String(routeError))
  return <AppError error={error} />
}
