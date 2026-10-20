import type { IncomingMessage, ServerResponse } from 'http'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8815424931:AAEmx8WSnc1sjxdBx98NXACBKBdiBED2fVo'
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-5544442243'

interface VercelReq extends IncomingMessage {
  body?: {
    name?: string
    phone?: string
    telegram?: string
    service?: string
    message?: string
    _hp?: string
  }
}

interface VercelRes extends ServerResponse {
  status: (code: number) => VercelRes
  json: (data: unknown) => void
}

export default async function handler(req: VercelReq, res: VercelRes) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.statusCode = 200
    res.end()
    return
  }

  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Method Not Allowed' }))
    return
  }

  try {
    // Parse body if it comes as string
    let body = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch {
        // keep as is
      }
    }

    const { name, phone, telegram, service, message, _hp } = body || {}

    // Honeypot antispam check
    if (_hp) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: true }))
      return
    }

    if (!name || !phone) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Ism va telefon raqami majburiy' }))
      return
    }

    const serviceLabels: Record<string, string> = {
      website: '🌐 Veb-sayt',
      telegram: '🤖 Telegram bot / mini-app',
      crm: '⚡ CRM va avtomatlashtirish',
      mobile: '📱 Mobil ilova',
      custom: '💡 Boshqa / Maxsus yechim',
    }

    const serviceName = (service && serviceLabels[service]) || service || 'Ko‘rsatilmagan'
    const now = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })

    const textLines = [
      '🚀 <b>YANGI ARIZA (gmetech.uz)</b>',
      '━━━━━━━━━━━━━━━━━━',
      `👤 <b>Mijoz:</b> ${escapeHtml(name)}`,
      `📞 <b>Telefon:</b> <code>${escapeHtml(phone)}</code>`,
      telegram ? `💬 <b>Telegram:</b> @${escapeHtml(telegram.replace(/^@/, ''))}` : '',
      `💼 <b>Xizmat:</b> ${serviceName}`,
      message ? `📝 <b>Izoh:</b>\n<i>${escapeHtml(message)}</i>` : '',
      '━━━━━━━━━━━━━━━━━━',
      `⏰ <b>Vaqt:</b> ${now}`,
    ].filter(Boolean)

    const text = textLines.join('\n')

    // Support both direct ID and -100 prefix for supergroups
    const chatIds = [CHAT_ID]
    if (!CHAT_ID.startsWith('-100') && CHAT_ID.startsWith('-')) {
      chatIds.push(`-100${CHAT_ID.slice(1)}`)
    }

    let sent = false
    let lastError: unknown = null

    for (const cid of chatIds) {
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: cid,
            text,
            parse_mode: 'HTML',
          }),
        })

        const data = (await tgRes.json()) as { ok: boolean; description?: string }
        if (data.ok) {
          sent = true
          break
        } else {
          lastError = data
        }
      } catch (err) {
        lastError = err
      }
    }

    if (!sent) {
      console.error('Telegram API error:', lastError)
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Telegramga xabar yuborishda xatolik', details: lastError }))
      return
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: true, message: 'Ariza muvaffaqiyatli qabul qilindi' }))
  } catch (error) {
    console.error('Server error:', error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Serverda xatolik yuz berdi' }))
  }
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
