import type { AdminLead, LeadStatus } from '@/types'

const STORAGE_KEY_LEADS = 'gme_admin_leads'

function getSeedLeads(): AdminLead[] {
  const now = new Date()
  return [
    {
      id: 'lead_seed_1',
      name: 'Shavkat Rahimov',
      phone: '+998 90 123 45 67',
      telegram: 'shavkat_retail',
      service: 'telegram',
      message: 'Kiyim do‘konimiz uchun kiyimlar katalogi va Click/Payme to‘lovli Telegram bot kerak.',
      createdAt: new Date(now.getTime() - 2 * 3600 * 1000).toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' }),
      status: 'new',
      notes: 'Birlamchi narxni so‘radi, smeta yuborish kerak.',
    },
    {
      id: 'lead_seed_2',
      name: 'Malika Karimova',
      phone: '+998 93 456 78 90',
      telegram: 'malika_edu',
      service: 'website',
      message: 'O‘quv markazimiz uchun zamonaviy vebsayt va o‘quvchilar ro‘yxatdan o‘tish tizimi.',
      createdAt: new Date(now.getTime() - 14 * 3600 * 1000).toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' }),
      status: 'contacted',
      notes: 'Telefon orqali bog‘lanildi, dushanbaga ofisda uchrashuv belgilandi.',
    },
    {
      id: 'lead_seed_3',
      name: 'Bobur Mirzayev',
      phone: '+998 97 789 01 23',
      telegram: 'bobur_logistics',
      service: 'crm',
      message: 'Omborxona va kuryerlar harakatini nazorat qiluvchi avtomatlashtirilgan CRM tizim.',
      createdAt: new Date(now.getTime() - 36 * 3600 * 1000).toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' }),
      status: 'deal',
      notes: 'Shartnoma imzolandi, MVP boshlandi.',
    },
  ]
}

export function getAllLeads(): AdminLead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADS)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {
    // fallback
  }

  const seed = getSeedLeads()
  saveLeads(seed)
  return seed
}

export function saveLeads(leads: AdminLead[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads))
  } catch (err) {
    console.error('Failed to save leads:', err)
  }
}

export function addLead(payload: {
  name: string
  phone: string
  telegram?: string
  service: string
  message?: string
}): AdminLead {
  const newLead: AdminLead = {
    id: 'lead_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    telegram: payload.telegram?.trim() || '',
    service: payload.service || 'custom',
    message: payload.message?.trim() || '',
    createdAt: new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' }),
    status: 'new',
  }

  const leads = getAllLeads()
  leads.unshift(newLead)
  saveLeads(leads)
  return newLead
}

export function updateLeadStatus(id: string, status: LeadStatus, notes?: string): void {
  const leads = getAllLeads()
  const target = leads.find((l) => l.id === id)
  if (target) {
    target.status = status
    if (notes !== undefined) {
      target.notes = notes
    }
    saveLeads(leads)
  }
}

export function deleteLead(id: string): void {
  const leads = getAllLeads().filter((l) => l.id !== id)
  saveLeads(leads)
}

export function getLeadsStats() {
  const leads = getAllLeads()
  return {
    total: leads.length,
    newCount: leads.filter((l) => l.status === 'new').length,
    contactedCount: leads.filter((l) => l.status === 'contacted').length,
    dealCount: leads.filter((l) => l.status === 'deal').length,
    rejectedCount: leads.filter((l) => l.status === 'rejected').length,
  }
}

export function exportLeadsAsJson(): void {
  const data = JSON.stringify(getAllLeads(), null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `gme_leads_${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}
