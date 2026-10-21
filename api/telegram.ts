import type { IncomingMessage, ServerResponse } from 'http'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8815424931:AAEmx8WSnc1sjxdBx98NXACBKBdiBED2fVo'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'gme2026admin'

interface VercelReq extends IncomingMessage {
  body?: any
}

interface VercelRes extends ServerResponse {
  status: (code: number) => VercelRes
  json: (data: unknown) => void
}

const MAIN_KEYBOARD = {
  keyboard: [
    [
      { text: '📊 AI Assistent xabarlari (7 kunlik) 🔐' },
      { text: '📝 Kelib tushgan arizalar 📥' },
    ],
    [
      { text: '🌐 GME Admin Panel ↗️' },
      { text: 'ℹ️ Bot holati' },
    ],
  ],
  resize_keyboard: true,
  is_persistent: true,
}

export default async function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')

  if (req.method === 'OPTIONS') {
    res.statusCode = 200
    res.end()
    return
  }

  if (req.method === 'GET') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ status: 'ok', bot: 'gmetechleads_bot' }))
    return
  }

  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end('Method Not Allowed')
    return
  }

  try {
    let body = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch {}
    }

    const update = body || {}
    const message = update.message || update.edited_message || update.callback_query?.message
    const callbackData = update.callback_query?.data

    if (!message || !message.chat) {
      res.statusCode = 200
      res.end('OK')
      return
    }

    const chatId = message.chat.id
    const userText = (message.text || callbackData || '').trim()
    const lower = userText.toLowerCase()

    // ─── 1. /start or /menu or Bosh menyu ───────────────────────────────────────
    if (lower === '/start' || lower === '/menu' || lower.includes('bosh menyu')) {
      const welcomeText = [
        'Assalomu alaykum! <b>GME Technologies</b> boshqaruv botiga xush kelibsiz. 🚀',
        '',
        'Ushbu bot orqali saytdan kelib tushgan haqiqiy <b>arizalar</b> va <b>AI Assistent</b> bilan bo‘lgan yozishmalar tahlilini kuzatib borishingiz mumkin.',
        '',
        '👇 <b>Quyidagi menyu tugmalaridan birini tanlang:</b>',
      ].join('\n')

      await sendTelegramMessage(chatId, welcomeText, MAIN_KEYBOARD)
      res.statusCode = 200
      res.end('OK')
      return
    }

    // ─── 2. AI Assistent xabarlari tugmasi ──────────────────────────────────────
    if (
      userText.includes('AI Assistent xabarlari') ||
      lower === '/ai' ||
      lower === 'ai'
    ) {
      const promptPasswordText = [
        '🔐 <b>Xavfsizlik tasdig‘i talab qilinadi!</b>',
        '━━━━━━━━━━━━━━━━━━',
        'AI Assistent bilan so‘nggi 7 kunda bo‘lgan haqiqiy savollar va yozishmalar tarixini ochish uchun <b>maxfiy admin parolini</b> yozib yuboring:',
        '',
        '<i>(Masalan: parolingizni oddiy xabar sifatida kiritib yuboring)</i>',
      ].join('\n')

      await sendTelegramMessage(chatId, promptPasswordText, {
        keyboard: [
          [{ text: '❌ Bekor qilish / Bosh menyu' }],
        ],
        resize_keyboard: true,
      })
      res.statusCode = 200
      res.end('OK')
      return
    }

    // ─── 3. Parol kiritilganda ────────────────────────────────────────────────
    if (userText === ADMIN_PASSWORD || lower === 'gme2026admin' || lower === 'admin2026') {
      const aiLogs: any[] = (globalThis as any).__GME_AI_LOGS__ || []

      if (aiLogs.length === 0) {
        const noLogsText = [
          '✅ <b>Parol tasdiqlandi!</b>',
          '━━━━━━━━━━━━━━━━━━',
          '🤖 <b>AI Assistent — So‘nggi 7 kunlik hisobot:</b>',
          '',
          'ℹ️ <i>Hozircha saytdagi AI assistentga yangi savollar berilmadi.</i>',
          'Mijozlar saytda savol berganda bu yerda real-vaqtda aks etadi.',
          '━━━━━━━━━━━━━━━━━━',
          '🌐 <b>Admin Panel:</b> gmetech.uz ariza formasi orqali to‘liq panelga kirishingiz mumkin.',
        ].join('\n')

        await sendTelegramMessage(chatId, noLogsText, MAIN_KEYBOARD)
      } else {
        const lines = [
          '✅ <b>Parol muvaffaqiyatli tasdiqlandi!</b>',
          '━━━━━━━━━━━━━━━━━━',
          '🤖 <b>AI Assistent — So‘nggi 7 kunlik hisobot:</b>',
          `📊 <b>Jami savollar soni:</b> ${aiLogs.length} ta`,
          '━━━━━━━━━━━━━━━━━━',
          '📋 <b>So‘nggi haqiqiy savollar:</b>',
        ]

        aiLogs.slice(0, 5).forEach((log, idx) => {
          lines.push(`${idx + 1}. ❓ <i>"${escapeHtml(log.userMessage)}"</i>`)
          if (log.botResponse) {
            lines.push(`   💬 <i>${escapeHtml(log.botResponse.slice(0, 80))}...</i>`)
          }
          lines.push(`   ⏰ ${log.timestamp || 'Yaqinda'}`)
        })

        lines.push('━━━━━━━━━━━━━━━━━━')
        lines.push('🌐 <i>To‘liq grafiklar va tahlil: gmetech.uz Admin Panelida.</i>')

        await sendTelegramMessage(chatId, lines.join('\n'), MAIN_KEYBOARD)
      }

      res.statusCode = 200
      res.end('OK')
      return
    }

    // ─── 4. Kelib tushgan arizalar ───────────────────────────────────────────
    if (userText.includes('Kelib tushgan arizalar') || lower === '/leads' || lower === 'arizalar') {
      const leads: any[] = (globalThis as any).__GME_LEADS__ || []

      if (leads.length === 0) {
        const noLeadsText = [
          '📝 <b>Kelib tushgan so‘nggi arizalar:</b>',
          '━━━━━━━━━━━━━━━━━━',
          'ℹ️ <i>Hozircha yangi arizalar kelib tushmadi.</i>',
          'Sayt orqali (gmetech.uz) mijozlar ariza qoldirganda bu yerda real-vaqtda aks etadi.',
        ].join('\n')

        await sendTelegramMessage(chatId, noLeadsText, MAIN_KEYBOARD)
      } else {
        const lines = [
          '📝 <b>Kelib tushgan haqiqiy arizalar:</b>',
          '━━━━━━━━━━━━━━━━━━',
        ]

        leads.slice(0, 5).forEach((lead, idx) => {
          lines.push(`${idx + 1}. 👤 <b>${escapeHtml(lead.name)}</b>`)
          lines.push(`   📞 <code>${escapeHtml(lead.phone)}</code>`)
          if (lead.telegram) lines.push(`   💬 @${escapeHtml(lead.telegram.replace(/^@/, ''))}`)
          lines.push(`   💼 <b>Xizmat:</b> ${escapeHtml(lead.service)}`)
          if (lead.message) lines.push(`   📝 <i>"${escapeHtml(lead.message)}"</i>`)
          lines.push(`   ⏰ <i>${lead.createdAt || 'Yaqinda'}</i>`)
          lines.push('')
        })

        lines.push('━━━━━━━━━━━━━━━━━━')
        lines.push('💡 <i>Yangi ariza kelganda ushbu botga darhol xabar yuboriladi.</i>')

        await sendTelegramMessage(chatId, lines.join('\n'), MAIN_KEYBOARD)
      }

      res.statusCode = 200
      res.end('OK')
      return
    }

    // ─── 5. GME Admin Panel ──────────────────────────────────────────────────
    if (userText.includes('GME Admin Panel') || lower === '/admin' || lower === 'admin') {
      const adminGuideText = [
        '🌐 <b>GME Technologies Maxfiy Admin Paneli</b>',
        '━━━━━━━━━━━━━━━━━━',
        'Xavfsizlik nuqtai nazaridan admin panel yashirin (stealth) rejimda ishlaydi.',
        '',
        '<b>Kirish qoidasi:</b>',
        '1. Brauzeringizda <b>gmetech.uz</b> saytiga kiring.',
        '2. <b>«Ariza qoldirish»</b> tugmasini bosing.',
        '3. <b>Telefon:</b> <code>+998 91 313 11 54</code> kiriting.',
        '4. <b>Ism:</b> <code>gme2026admin</code> kiriting.',
        '5. <b>«Ariza yuborish»</b> tugmasini bosing.',
        '',
        '🚀 Tizim ariza yubormasdan to‘g‘ridan-to‘g‘ri boshqaruv panelini ochadi!',
      ].join('\n')

      await sendTelegramMessage(
        chatId,
        adminGuideText,
        MAIN_KEYBOARD,
        [
          [{ text: '🌐 Saytga o‘tish (gmetech.uz)', url: 'https://gmetech.uz' }],
        ]
      )
      res.statusCode = 200
      res.end('OK')
      return
    }

    // ─── 6. Bot holati ───────────────────────────────────────────────────────
    if (userText.includes('Bot holati') || lower === '/help' || lower === 'yordam') {
      const helpText = [
        'ℹ️ <b>GME Tech Leads Bot Ma’lumotlari</b>',
        '━━━━━━━━━━━━━━━━━━',
        '• <b>Bot nomi:</b> @gmetechleads_bot',
        '• <b>Holat:</b> 🟢 Online (Faol)',
        '• <b>Vazifasi:</b> Sayt arizalari va AI Assistent tahlili',
        '• <b>Bosh ofis:</b> Samarqand shahar, O‘zbekiston',
        '• <b>Bog‘lanish:</b> +998 91 313 11 54',
        '• <b>Rasmiy sayt:</b> https://gmetech.uz',
      ].join('\n')

      await sendTelegramMessage(chatId, helpText, MAIN_KEYBOARD)
      res.statusCode = 200
      res.end('OK')
      return
    }

    // ─── 7. Bekor qilish / Bosh menyu ────────────────────────────────────────
    if (lower.includes('bekor') || lower.includes('bosh menyu')) {
      await sendTelegramMessage(chatId, 'Bosh menyuga qaytdingiz. 👇', MAIN_KEYBOARD)
      res.statusCode = 200
      res.end('OK')
      return
    }

    // ─── Fallback: Noma'lum xabar yoki xato parol ─────────────────────────────
    const unknownText = [
      '❌ <b>Noto‘g‘ri buyruq yoki parol!</b>',
      '',
      'Iltimos, pastdagi blokli menyu tugmalaridan birini tanlang yoki parolni tekshirib qayta kiriting.',
    ].join('\n')

    await sendTelegramMessage(chatId, unknownText, MAIN_KEYBOARD)
    res.statusCode = 200
    res.end('OK')
  } catch (err) {
    console.error('Telegram webhook error:', err)
    res.statusCode = 200
    res.end('OK')
  }
}

async function sendTelegramMessage(
  chatId: number | string,
  text: string,
  replyMarkup?: any,
  inlineKeyboard?: any[]
) {
  const payload: any = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  }

  if (inlineKeyboard) {
    payload.reply_markup = { inline_keyboard: inlineKeyboard }
  } else if (replyMarkup) {
    payload.reply_markup = replyMarkup
  }

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('Failed to send Telegram message:', err)
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
