import type { Stat } from '@/types'

export const stats: Stat[] = [
  { id: 'projects', value: 0, suffix: '+', labelKey: 'stats.projects' },
  { id: 'years', value: 0, suffix: '', labelKey: 'stats.years' },
  { id: 'clients', value: 0, suffix: '+', labelKey: 'stats.clients' },
  { id: 'regions', value: 0, suffix: '', labelKey: 'stats.regions' },
]
// TODO: Replace 0 values with real numbers before launch
