import type { Stat } from '@/types'

export const stats: Stat[] = [
  { id: 'projects', value: 10, suffix: '+', labelKey: 'stats.projects' },
  { id: 'years', value: 1, suffix: ' yil', suffixKey: 'stats.yearsSuffix', labelKey: 'stats.years' },
  { id: 'clients', value: 20, suffix: '+', labelKey: 'stats.clients' },
  { id: 'regions', value: 3, suffix: '', labelKey: 'stats.regions' },
]
