import { type } from 'arktype'
import { iconNameSet } from '../utils/icons'

const lucideIconName = type('string >= 1').narrow(
  (s, ctx) =>
    iconNameSet.has(s) || ctx.mustBe('a valid Lucide icon name like "list"'),
)

export const taskFormSchema = type({
  title: 'string >= 1',
  'icon?': lucideIconName,
})

export type TaskFormData = typeof taskFormSchema.infer
