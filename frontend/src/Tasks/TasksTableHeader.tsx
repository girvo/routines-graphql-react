import styles from './TasksTableHeader.module.css'

export const TasksTableHeader = () => (
  <div className={styles.row}>
    <span className={styles.label}>Task</span>
    <span className={styles.label}>Used in</span>
    <span className={styles.slotsLabel}>Slots</span>
    <span className={styles.actionsSpacer} aria-hidden />
  </div>
)
