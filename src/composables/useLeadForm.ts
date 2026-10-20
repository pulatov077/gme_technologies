import { ref, reactive } from 'vue'
import type { LeadFormPayload } from '@/types'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const PHONE_RE = /^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/

const BOT_TOKEN = '8815424931:AAEmx8WSnc1sjxdBx98NXACBKBdiBED2fVo'
const CHAT_ID = '-5544442243'

export function useLeadForm() {
  const status = ref<FormStatus>('idle')
  const errors = reactive<Partial<Record<keyof LeadFormPayload, string>>>({})

  const fields = reactive<LeadFormPayload>({
    name: '',
    phone: '',
    telegram: '',
    service: '',
    message: '',
    consent: false,
    _hp: '', // honeypot — must stay empty
  })

  function validate(): boolean {
    errors.name = fields.name.trim() ? undefined : 'required'
    errors.phone = PHONE_RE.test(fields.phone.replace(/\s/g, '').trim())
      ? undefined
      : 'phoneInvalid'
    errors.service = fields.service ? undefined : 'required'
    errors.consent = fields.consent ? undefined : 'consentRequired'
    return !Object.values(errors).some(Boolean)
  }

  function reset() {
    fields.name = ''
    fields.phone = ''
    fields.telegram = ''
    fields.service = ''
    fields.message = ''
    fields.consent = false
    fields._hp = ''
    Object.keys(errors).forEach((k) => delete errors[k as keyof LeadFormPayload])
    status.value = 'idle'
  }

  async function submit() {
    if (!validate()) return

    // Honeypot check
    if (fields._hp) return

    status.value = 'loading'

    const payload = {
      name: fields.name.trim(),
      phone: fields.phone.trim(),
      telegram: fields.telegram?.trim() || '',
      service: fields.service,
      message: fields.message.trim(),
      consent: fields.consent,
    }

    // 1. Try Vercel Serverless /api/lead endpoint
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        status.value = 'success'
        return
      }
    } catch {
      // If /api/lead not available (e.g. static dev server or direct hosting), fallback to direct Telegram
    }

    // 2. Direct Telegram API fallback
    try {
      const serviceLabels: Record<string, string> = {
        website: '🌐 Veb-sayt',
        telegram: '🤖 Telegram bot / mini-app',
        crm: '⚡ CRM va avtomatlashtirish',
        mobile: '📱 Mobil ilova',
        custom: '💡 Boshqa / Maxsus yechim',
      }

      const serviceName = serviceLabels[payload.service] || payload.service || 'Ko‘rsatilmagan'
      const now = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })

      const text = [
        '🚀 <b>YANGI ARIZA (gmetech.uz)</b>',
        '━━━━━━━━━━━━━━━━━━',
        `👤 <b>Mijoz:</b> ${payload.name}`,
        `📞 <b>Telefon:</b> <code>${payload.phone}</code>`,
        payload.telegram ? `💬 <b>Telegram:</b> @${payload.telegram.replace(/^@/, '')}` : '',
        `💼 <b>Xizmat:</b> ${serviceName}`,
        payload.message ? `📝 <b>Izoh:</b>\n<i>${payload.message}</i>` : '',
        '━━━━━━━━━━━━━━━━━━',
        `⏰ <b>Vaqt:</b> ${now}`,
      ].filter(Boolean).join('\n')

      const chatIds = [CHAT_ID]
      if (!CHAT_ID.startsWith('-100') && CHAT_ID.startsWith('-')) {
        chatIds.push(`-100${CHAT_ID.slice(1)}`)
      }

      let sent = false
      for (const cid of chatIds) {
        const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: cid,
            text,
            parse_mode: 'HTML',
          }),
        })
        const data = await tgRes.json()
        if (data.ok) {
          sent = true
          break
        }
      }

      if (sent) {
        status.value = 'success'
      } else {
        throw new Error('Telegram send failed')
      }
    } catch {
      status.value = 'error'
    }
  }

  return { fields, errors, status, validate, submit, reset }
}
