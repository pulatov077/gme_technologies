import type { AiChatLog } from '@/types'

const STORAGE_KEY_AI_LOGS = 'gme_ai_chat_logs'
const STORAGE_KEY_SESSION = 'gme_ai_session_id'

const BOT_TOKEN = '8815424931:AAEmx8WSnc1sjxdBx98NXACBKBdiBED2fVo'
const CHAT_ID = '-5544442243'

export function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem(STORAGE_KEY_SESSION)
    if (!sid) {
      sid = 'usr_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36)
      sessionStorage.setItem(STORAGE_KEY_SESSION, sid)
    }
    return sid
  } catch {
    return 'usr_' + Math.random().toString(36).substring(2, 9)
  }
}

export function detectDevice(): 'Mobile' | 'Desktop' | 'Tablet' {
  if (typeof window === 'undefined') return 'Desktop'
  const ua = navigator.userAgent.toLowerCase()
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return 'Tablet'
  if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(ua)) return 'Mobile'
  return 'Desktop'
}

export function detectCategory(text: string): string {
  const lower = text.toLowerCase()
  if (lower.includes('bot') || lower.includes('telegram') || lower.includes('mini app')) {
    return '🤖 Telegram Bot'
  }
  if (lower.includes('sayt') || lower.includes('veb') || lower.includes('website') || lower.includes('сайт')) {
    return '🌐 Veb-sayt'
  }
  if (lower.includes('crm') || lower.includes('erp') || lower.includes('ombor') || lower.includes('avtomat')) {
    return '⚡ CRM & Avtomatlashtirish'
  }
  if (lower.includes('narx') || lower.includes('qancha') || lower.includes('pul') || lower.includes('price') || lower.includes('цен')) {
    return '💰 Narxlar & Smeta'
  }
  if (lower.includes('muddat') || lower.includes('qachon') || lower.includes('vaqt') || lower.includes('time') || lower.includes('срок')) {
    return '⏱ Ishlash muddati'
  }
  if (lower.includes('mobil') || lower.includes('ilova') || lower.includes('app') || lower.includes('ios') || lower.includes('android')) {
    return '📱 Mobil Ilova'
  }
  return '💡 Umumiy savol'
}

export function getAllLogs(): AiChatLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AI_LOGS)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        // Filter out any demo/seed logs
        const realLogs = parsed.filter(
          (l: AiChatLog) => l && l.id && !l.id.startsWith('seed_')
        )
        if (realLogs.length !== parsed.length) {
          saveLogs(realLogs)
        }
        return realLogs
      }
    }
  } catch (err) {
    console.warn('Error reading AI logs:', err)
  }

  return []
}

export function saveLogs(logs: AiChatLog[]): void {
  try {
    // Keep max 1000 logs
    const trimmed = logs.slice(0, 1000)
    localStorage.setItem(STORAGE_KEY_AI_LOGS, JSON.stringify(trimmed))
  } catch (err) {
    console.error('Failed to save AI logs:', err)
  }
}

export async function logAiInteraction(params: {
  userMessage: string
  botResponse: string
  locale?: string
}): Promise<AiChatLog> {
  const sessionId = getSessionId()
  const device = detectDevice()
  const category = detectCategory(params.userMessage)
  const now = new Date()
  const dateStr = now.toISOString().split('T')[0] || ''
  const timestampStr = now.toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })

  const newLog: AiChatLog = {
    id: 'ai_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
    sessionId,
    timestamp: timestampStr,
    date: dateStr,
    userMessage: params.userMessage.trim(),
    botResponse: params.botResponse.trim(),
    category,
    device,
    locale: params.locale || 'uz',
  }

  // Prepend new log
  const existing = getAllLogs()
  existing.unshift(newLog)
  saveLogs(existing)

  // AI chat logs are confidential and only visible in Admin Panel or Bot on password prompt
  return newLog
}

async function sendTelegramNotification(log: AiChatLog): Promise<void> {
  const payload = {
    userMessage: log.userMessage,
    botResponse: log.botResponse.slice(0, 200) + (log.botResponse.length > 200 ? '...' : ''),
    category: log.category,
    device: log.device,
    timestamp: log.timestamp,
    sessionId: log.sessionId,
  }

  // 1. Try serverless /api/ai-log
  try {
    const res = await fetch('/api/ai-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) return
  } catch {
    // fallback
  }

  // 2. Direct Telegram API fallback
  try {
    const text = [
      '🤖 <b>AI ASSISTENTGA YANGI SAVOL</b>',
      '━━━━━━━━━━━━━━━━━━',
      `❓ <b>Savol:</b> <i>"${escapeHtml(log.userMessage)}"</i>`,
      `💡 <b>Mavzu:</b> ${log.category}`,
      `📱 <b>Qurilma:</b> ${log.device}`,
      `⏰ <b>Vaqt:</b> ${log.timestamp}`,
      '━━━━━━━━━━━━━━━━━━',
      '🔐 <i>7 kunlik xabarlar arxivini ko‘rish uchun saytdagi ariza formasida admin kalitingizni kiriting.</i>',
    ].join('\n')

    const chatIds = [CHAT_ID]
    if (!CHAT_ID.startsWith('-100') && CHAT_ID.startsWith('-')) {
      chatIds.push(`-100${CHAT_ID.slice(1)}`)
    }

    for (const cid of chatIds) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: cid,
          text,
          parse_mode: 'HTML',
        }),
      })
    }
  } catch (err) {
    console.warn('Failed to send AI log to Telegram:', err)
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// 7-day query & analytics functions
export function getLogsForLastDays(days = 7): AiChatLog[] {
  const all = getAllLogs()
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const cutoffTime = cutoff.getTime()

  return all.filter((l) => {
    // Parse timestamp or date
    const d = new Date(l.date)
    return !isNaN(d.getTime()) && d.getTime() >= cutoffTime
  })
}

export interface AiWeeklyStats {
  totalQuestions: number
  uniqueUsers: number
  categoryCounts: Record<string, number>
  deviceCounts: { Mobile: number; Desktop: number; Tablet: number }
  dailyCounts: Array<{ date: string; dayLabel: string; count: number }>
}

export function getWeeklyStats(days = 7): AiWeeklyStats {
  const logs = getLogsForLastDays(days)
  const userSet = new Set<string>()
  const catCounts: Record<string, number> = {}
  const devCounts = { Mobile: 0, Desktop: 0, Tablet: 0 }
  const dateMap: Record<string, number> = {}

  // Prepare date range
  const now = new Date()
  const dayNames = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan']

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 3600 * 1000)
    const dStr = d.toISOString().split('T')[0] || ''
    if (dStr) {
      dateMap[dStr] = 0
    }
  }

  for (const log of logs) {
    if (log.sessionId) userSet.add(log.sessionId)

    catCounts[log.category] = (catCounts[log.category] || 0) + 1

    if (log.device in devCounts) {
      devCounts[log.device as keyof typeof devCounts]++
    }

    if (log.date && typeof dateMap[log.date] === 'number') {
      dateMap[log.date] = (dateMap[log.date] ?? 0) + 1
    }
  }

  const dailyCounts = Object.entries(dateMap).map(([dStr, count]) => {
    const dObj = new Date(dStr)
    const dayLabel = dayNames[dObj.getDay()] || dStr
    return {
      date: dStr,
      dayLabel,
      count,
    }
  })

  return {
    totalQuestions: logs.length,
    uniqueUsers: userSet.size || Math.max(1, Math.ceil(logs.length / 2)),
    categoryCounts: catCounts,
    deviceCounts: devCounts,
    dailyCounts,
  }
}

export function deleteLog(id: string): void {
  const logs = getAllLogs().filter((l) => l.id !== id)
  saveLogs(logs)
}

export function clearAllLogs(): void {
  saveLogs([])
}

export function exportLogsAsJson(): void {
  const data = JSON.stringify(getAllLogs(), null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `gme_ai_logs_${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}
