import type { AdminLead, LeadStatus } from '@/types'
import { supabase } from '@/services/supabase'

const STORAGE_KEY_LEADS = 'gme_admin_leads'

// Retrieve stored leads, purging any demo/seed items
export function getAllLeads(): AdminLead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADS)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        const realLeads = parsed.filter(
          (l: AdminLead) =>
            l &&
            l.id &&
            !l.id.startsWith('lead_seed_') &&
            !l.name.includes('Shavkat Rahimov') &&
            !l.name.includes('Malika Karimova') &&
            !l.name.includes('Bobur Mirzayev')
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
  return []
}

export function saveLeads(leads: AdminLead[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads))
  } catch (err) {
    console.error('Failed to save leads:', err)
  }
}

// Map database row to AdminLead
function mapRowToLead(row: any): AdminLead {
  return {
    id: String(row.id),
    name: row.name || '',
    phone: row.phone || '',
    telegram: row.telegram || '',
    service: row.service || 'custom',
    message: row.message || '',
    createdAt: row.created_at
      ? new Date(row.created_at).toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })
      : new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' }),
    status: (row.status as LeadStatus) || 'new',
    notes: row.notes || '',
  }
}

// Fetch leads from Supabase and sync with local storage
export async function syncLeadsWithServer(): Promise<AdminLead[]> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && Array.isArray(data)) {
      const mapped = data.map(mapRowToLead)
      saveLeads(mapped)
      return mapped
    }
  } catch (err) {
    console.warn('Supabase fetch failed, falling back to local/api:', err)
  }

  // Fallback to /api/leads
  try {
    const res = await fetch('/api/leads')
    if (res.ok) {
      const apiData = await res.json()
      if (Array.isArray(apiData.leads)) {
        const local = getAllLeads()
        const map = new Map<string, AdminLead>()
        for (const l of local) map.set(l.id, l)
        for (const s of apiData.leads) {
          if (!map.has(s.id)) map.set(s.id, s)
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

export async function addLead(payload: {
  name: string
  phone: string
  telegram?: string
  service: string
  message?: string
  status?: LeadStatus
  notes?: string
}): Promise<AdminLead> {
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

  // 1. Save to local state immediately
  const leads = getAllLeads()
  leads.unshift(newLead)
  saveLeads(leads)

  // 2. Insert into Supabase
  try {
    await supabase.from('leads').insert([
      {
        id: newLead.id,
        name: newLead.name,
        phone: newLead.phone,
        telegram: newLead.telegram,
        service: newLead.service,
        message: newLead.message,
        status: newLead.status,
        notes: newLead.notes,
      },
    ])
  } catch (err) {
    console.warn('Supabase insert failed:', err)
  }

  // 3. Sync to API fallback
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
    // Fallback
  }
}

export async function updateLeadStatus(id: string, status: LeadStatus, notes?: string): Promise<void> {
  const leads = getAllLeads()
  const target = leads.find((l) => l.id === id)
  if (target) {
    target.status = status
    if (notes !== undefined) {
      target.notes = notes
    }
    saveLeads(leads)
  }

  // Update in Supabase
  try {
    const updatePayload: any = { status }
    if (notes !== undefined) {
      updatePayload.notes = notes
    }
    await supabase.from('leads').update(updatePayload).eq('id', id)
  } catch (err) {
    console.warn('Supabase update failed:', err)
  }
}

export async function deleteLead(id: string): Promise<void> {
  const leads = getAllLeads().filter((l) => l.id !== id)
  saveLeads(leads)

  // Delete from Supabase
  try {
    await supabase.from('leads').delete().eq('id', id)
  } catch (err) {
    console.warn('Supabase delete failed:', err)
  }
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
