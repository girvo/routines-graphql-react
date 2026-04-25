import { DynamicIcon } from 'lucide-react/dynamic'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { IconChip } from '../primitives/IconChip.tsx'
import { Popover, PopoverContent, PopoverTrigger } from '../primitives/popover/Popover.tsx'
import { parseIconName } from '../utils/icons.ts'
import { sectionLabel, type SectionCount } from './section-counts.ts'
import styles from './TaskCard.module.css'

interface TaskCardProps {
  title: string
  icon: string | null | undefined
  sections: SectionCount[]
  totalSlots: number
  hasMoreSlots: boolean
  onEdit: () => void
  onDelete: () => void
}

const iconFromName = (icon: string | null | undefined) => {
  const name = parseIconName(icon)
  const Component = ({ className }: { className?: string }) => (
    <DynamicIcon name={name} className={className} />
  )
  return Component
}

export const TaskCard = ({
  title,
  icon,
  sections,
  totalSlots,
  hasMoreSlots,
  onEdit,
  onDelete,
}: TaskCardProps) => {
  const IconGlyph = iconFromName(icon)

  return (
    <div className={styles.root}>
      <span className={styles.iconChip}>
        <IconChip icon={IconGlyph} size="md" />
      </span>
      <span className={styles.title}>{title}</span>
      <div className={styles.used}>
        {sections.length === 0 ? (
          <span className={styles.unassigned}>Not yet assigned</span>
        ) : (
          sections.map(({ section, count }) => (
            <SectionChip key={section} label={sectionLabel(section)} count={count} />
          ))
        )}
      </div>
      <span className={styles.slotsCount}>
        {totalSlots}
        {hasMoreSlots ? '+' : ''}
      </span>
      <div className={styles.actions}>
        <button type="button" className={styles.iconBtn} onClick={onEdit} aria-label="Edit task">
          <Pencil className={styles.iconSm} />
        </button>
        <button
          type="button"
          className={`${styles.iconBtn} ${styles.danger}`}
          onClick={onDelete}
          aria-label="Delete task"
        >
          <Trash2 className={styles.iconSm} />
        </button>
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.dots} ${styles.mobileOnly}`}
              aria-label="Task actions"
            >
              <MoreHorizontal className={styles.iconSm} />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <TaskCardMenu onEdit={onEdit} onDelete={onDelete} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

const TaskCardMenu = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 140 }}>
    <button
      type="button"
      className={styles.iconBtn}
      onClick={onEdit}
      style={{ width: '100%', justifyContent: 'flex-start', height: 32, padding: '0 12px', gap: 8 }}
    >
      <Pencil className={styles.iconSm} />
      Edit
    </button>
    <button
      type="button"
      className={`${styles.iconBtn} ${styles.danger}`}
      onClick={onDelete}
      style={{ width: '100%', justifyContent: 'flex-start', height: 32, padding: '0 12px', gap: 8 }}
    >
      <Trash2 className={styles.iconSm} />
      Delete
    </button>
  </div>
)

const SectionChip = ({ label, count }: { label: string; count: number }) => (
  <span className={styles.sectionChip}>
    <span className={styles.sectionName}>{label}</span>
    <span className={styles.sectionCount}>×{count}</span>
  </span>
)
