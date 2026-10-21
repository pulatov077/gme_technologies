import type { IncomingMessage, ServerResponse } from 'http'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8815424931:AAEmx8WSnc1sjxdBx98NXACBKBdiBED2fVo'
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-5544442243'

interface VercelReq extends IncomingMessage {
  body?: {
    userMessage?: string
    botResponse?: string
    category?: string
    device?: string
    timestamp?: string
    sessionId?: string
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
    let body = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch {
        // keep as is
      }
    }

    const { userMessage, botResponse, category, device, timestamp } = body || {}

    if (!userMessage) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Xabar matni bo‘sh' }))
      return
    }

    const timeStr = timestamp || new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })
    const previewResp = (botResponse || '').slice(0, 200)

    const textLines = [
      '🤖 <b>AI ASSISTENTGA YANGI SAVOL</b>',
      '━━━━━━━━━━━━━━━━━━',
      `❓ <b>Savol:</b> <i>"${escapeHtml(userMessage)}"</i>`,
      category ? `💡 <b>Mavzu:</b> ${escapeHtml(category)}` : '',
      device ? `📱 <b>Qurilma:</b> ${escapeHtml(device)}` : '',
      previewResp ? `💬 <b>Bot javobi:</b>\n<i>${escapeHtml(previewResp)}...</i>` : '',
      '━━━━━━━━━━━━━━━━━━',
      `⏰ <b>Vaqt:</b> ${timeStr}`,
      '',
      '🔐 <i>7 kunlik xabarlar arxivini ko‘rish uchun saytning ariza qoldirish formasida admin parolini kiriting.</i>',
    ].filter(Boolean)

    const text = textLines.join('\n')

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
      console.warn('Telegram send failed:', lastError)
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: true }))
  } catch (err) {
    console.error('API error:', err)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Serverda xatolik' }))
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
