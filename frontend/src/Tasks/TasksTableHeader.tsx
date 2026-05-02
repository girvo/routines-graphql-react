import styles from './TasksTableHeader.module.css'

export const TasksTableHeader = () => (
  <div className={styles.row}>
    <span className={styles.label}>Task</span>
    <span className={styles.label}>Used in</span>
    <span className={styles.actionsLabel}>Actions</span>
  </div>
)
