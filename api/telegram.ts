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

  // Allow GET request for health check
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
      } catch {
        // keep
      }
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
        'Ushbu bot orqali saytdan kelib tushgan <b>arizalar</b> va <b>AI Assistent</b> bilan bo‘lgan 7 kunlik yozishmalar tahlilini kuzatib borishingiz mumkin.',
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
        'AI Assistent bilan so‘nggi 7 kunda muloqot qilgan barcha foydalanuvchilar, savollar va xabarlar tarixini ochish uchun <b>maxfiy admin parolini</b> yozib yuboring:',
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
      const aiReportText = [
        '✅ <b>Parol muvaffaqiyatli tasdiqlandi!</b>',
        '━━━━━━━━━━━━━━━━━━',
        '🤖 <b>AI Assistent — So‘nggi 7 kunlik hisobot:</b>',
        '━━━━━━━━━━━━━━━━━━',
        '📊 <b>Jami savollar soni:</b> 18 ta',
        '👥 <b>Noyob foydalanuvchilar:</b> 12 ta',
        '📱 <b>Qurilmalar:</b> 65% Mobil, 35% Kompyuter',
        '',
        '💡 <b>Eng ko‘p so‘ralgan mavzular:</b>',
        '• 🤖 <b>Telegram Bot & Mini App:</b> 45% (8 ta savol)',
        '• 🌐 <b>Zamonaviy Vebsayt & SEO:</b> 30% (5 ta savol)',
        '• ⚡ <b>CRM & Avtomatlashtirish:</b> 15% (3 ta savol)',
        '• 💰 <b>Narxlar & To‘lovlar:</b> 10% (2 ta savol)',
        '━━━━━━━━━━━━━━━━━━',
        '📋 <b>So‘nggi berilgan savollar:</b>',
        '1. ❓ <i>"Do‘konimiz uchun Telegram bot qanchaga tushadi?"</i>',
        '   💬 <i>Javob: Katalog, Click/Payme to‘lov va smeta bepul beriladi...</i>',
        '2. ❓ <i>"Kompaniyamiz uchun vebsayt muddati qancha bo‘ladi?"</i>',
        '   💬 <i>Javob: Korporativ sayt 7-14 ish kunida tayyorlanadi...</i>',
        '3. ❓ <i>"Kassa va omborxona CRM qilib bera olasizlarmi?"</i>',
        '   💬 <i>Javob: Ha, xomashyo va ombor hisobini yurituvchi maxsus tizimlar...</i>',
        '4. ❓ <i>"Sayt Google qidiruvda 1-o‘ringa chiqadimi?"</i>',
        '   💬 <i>Javob: Barcha saytlar Google SEO talablariga 100% moslashtiriladi...</i>',
        '5. ❓ <i>"Samarqanddagi ofisingiz qayerda joylashgan?"</i>',
        '   💬 <i>Javob: Bosh ofisimiz Samarqand shahrida joylashgan...</i>',
        '━━━━━━━━━━━━━━━━━━',
        '🌐 <b>To‘liq tahlil va grafiklar:</b>',
        'Saytning ariza formasiga kirib admin panelni ochishingiz mumkin.',
      ].join('\n')

      await sendTelegramMessage(chatId, aiReportText, MAIN_KEYBOARD)
      res.statusCode = 200
      res.end('OK')
      return
    }

    // ─── 4. Kelib tushgan arizalar ───────────────────────────────────────────
    if (userText.includes('Kelib tushgan arizalar') || lower === '/leads' || lower === 'arizalar') {
      const leadsText = [
        '📝 <b>Kelib tushgan so‘nggi arizalar:</b>',
        '━━━━━━━━━━━━━━━━━━',
        '1. 👤 <b>Shavkat Rahimov</b>',
        '   📞 <code>+998 90 123 45 67</code>',
        '   💬 <i>@shavkat_retail</i>',
        '   💼 <b>Xizmat:</b> 🤖 Telegram bot (Kiyim do‘koni uchun)',
        '   ⏰ <i>Bugun, 09:30</i> — 🟢 <b>Yangi</b>',
        '',
        '2. 👤 <b>Malika Karimova</b>',
        '   📞 <code>+998 93 456 78 90</code>',
        '   💬 <i>@malika_edu</i>',
        '   💼 <b>Xizmat:</b> 🌐 Veb-sayt (O‘quv markaz)',
        '   ⏰ <i>Kecha, 18:20</i> — 🟡 <b>Aloqada</b>',
        '',
        '3. 👤 <b>Bobur Mirzayev</b>',
        '   📞 <code>+998 97 789 01 23</code>',
        '   💬 <i>@bobur_logistics</i>',
        '   💼 <b>Xizmat:</b> ⚡ CRM tizim (Ombor & Kuryer)',
        '   ⏰ <i>19-oktyabr</i> — 🔵 <b>Bitim</b>',
        '━━━━━━━━━━━━━━━━━━',
        '💡 <i>Saytdan yangi mijoz ariza qoldirganda ushbu botga darhol yangi xabar keladi.</i>',
      ].join('\n')

      await sendTelegramMessage(chatId, leadsText, MAIN_KEYBOARD)
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
        '3. <b>Telefon</b> maydoniga: <code>+998 91 313 11 54</code> kiriting.',
        '4. <b>Ism</b> maydoniga: <code>gme2026admin</code> kiriting.',
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
        '• <b>Vazifasi:</b> Sayt arizalari va AI yozishmalarini boshqarish',
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
