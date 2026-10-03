import { ref, reactive } from 'vue'
import type { LeadFormPayload } from '@/types'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const PHONE_RE = /^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/

export function useLeadForm() {
  const status = ref<FormStatus>('idle')
  const errors = reactive<Partial<Record<keyof LeadFormPayload, string>>>({})

  const fields = reactive<LeadFormPayload>({
    name: '',
    phone: '',
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

    const apiUrl = import.meta.env.VITE_API_URL as string | undefined

    if (!apiUrl) {
      // Dev mode – log payload, simulate success
      console.log('[DEV] Lead form payload:', { ...fields, _hp: '[REDACTED]' })
      await new Promise((r) => setTimeout(r, 800))
      status.value = 'success'
      return
    }

    try {
      const res = await fetch(`${apiUrl}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name,
          phone: fields.phone,
          service: fields.service,
          message: fields.message,
          consent: fields.consent,
        }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      status.value = 'success'
    } catch {
      status.value = 'error'
    }
  }

  return { fields, errors, status, validate, submit, reset }
}
