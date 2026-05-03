import { useState } from 'react'
import { clsx } from 'clsx'
import { Popover, PopoverContent, PopoverTrigger } from '../overlay/popover/Popover.tsx'
import { IconBadge } from '../badge/IconBadge.tsx'
import {
  iconCategories,
  iconLabel,
  iconRegistry,
  parseIconName,
  type IconName,
} from '../../utils/icons.ts'
import styles from './IconPicker.module.css'

interface IconPickerProps {
  value: string | null
  onChange: (name: IconName) => void
  disabled?: boolean
  'aria-label'?: string
}

export const IconPicker = ({
  value,
  onChange,
  disabled,
  'aria-label': ariaLabel,
}: IconPickerProps) => {
  const [open, setOpen] = useState(false)
  const hasSelection = value !== null && value !== '' && value in iconRegistry
  const currentName = parseIconName(value)
  const TriggerIcon = iconRegistry[currentName]

  const handleSelect = (name: IconName) => {
    onChange(name)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <button
          type="button"
          className={clsx(styles.trigger, !hasSelection && styles.placeholder)}
          disabled={disabled}
          aria-label={ariaLabel ?? 'Pick icon'}
        >
          <IconBadge icon={TriggerIcon} size="md" />
        </button>
      </PopoverTrigger>
      <PopoverContent className={styles.popover}>
        <div className={styles.scroll}>
          {iconCategories.map(({ label, icons }) => (
            <section key={label} className={styles.section}>
              <h4 className={styles.heading}>{label}</h4>
              <div className={styles.grid}>
                {icons.map(name => {
                  const Glyph = iconRegistry[name]
                  const isSelected = name === value
                  return (
                    <button
                      key={name}
                      type="button"
                      className={clsx(styles.tile, isSelected && styles.selected)}
                      onClick={() => handleSelect(name)}
                      aria-label={iconLabel(name)}
                      aria-pressed={isSelected}
                    >
                      <Glyph className={styles.glyph} />
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
