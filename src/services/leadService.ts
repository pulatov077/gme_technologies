import type { AdminLead, LeadStatus } from '@/types'

const STORAGE_KEY_LEADS = 'gme_admin_leads'

// Retrieve stored leads, purging any demo/seed items
export function getAllLeads(): AdminLead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADS)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        // Strip out any demo/seed leads
        const realLeads = parsed.filter(
          (l: AdminLead) => l && l.id && !l.id.startsWith('lead_seed_') && !l.name.includes('Shavkat Rahimov') && !l.name.includes('Malika Karimova') && !l.name.includes('Bobur Mirzayev')
        )
        if (realLeads.length !== parsed.length) {
          saveLeads(realLeads)
        }
        return realLeads
      }
    }
  } catch (err) {
    console.warn('Error reading leads from storage:', err)
  }

  // Return empty array if no real leads exist yet
  return []
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
  status?: LeadStatus
  notes?: string
}): AdminLead {
  const newLead: AdminLead = {
    id: 'lead_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    telegram: payload.telegram?.trim() || '',
    service: payload.service || 'custom',
    message: payload.message?.trim() || '',
    createdAt: new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' }),
    status: payload.status || 'new',
    notes: payload.notes || '',
  }

  const leads = getAllLeads()
  leads.unshift(newLead)
  saveLeads(leads)

  // Also sync to server in background
  syncLeadToServer(newLead)

  return newLead
}

async function syncLeadToServer(lead: AdminLead) {
  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })
  } catch {
    // Offline or fallback to local
  }
}

// Fetch any leads stored on the server and merge into local
export async function syncLeadsWithServer(): Promise<AdminLead[]> {
  try {
    const res = await fetch('/api/leads')
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data.leads)) {
        const local = getAllLeads()
        const map = new Map<string, AdminLead>()
        for (const l of local) map.set(l.id, l)
        for (const s of data.leads) {
          if (!map.has(s.id)) {
            map.set(s.id, s)
          }
        }
        const merged = Array.from(map.values()).sort(
          (a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')
        )
        saveLeads(merged)
        return merged
      }
    }
  } catch {
    // Offline
  }
  return getAllLeads()
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
