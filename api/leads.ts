import type { IncomingMessage, ServerResponse } from 'http'

interface VercelReq extends IncomingMessage {
  body?: any
}

interface VercelRes extends ServerResponse {
  status: (code: number) => VercelRes
  json: (data: unknown) => void
}

export default async function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.statusCode = 200
    res.end()
    return
  }

  ;(globalThis as any).__GME_LEADS__ = (globalThis as any).__GME_LEADS__ || []

  if (req.method === 'GET') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: true, leads: (globalThis as any).__GME_LEADS__ }))
    return
  }

  if (req.method === 'POST') {
    try {
      let body = req.body
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body)
        } catch {}
      }

      if (body && body.name && body.phone) {
        const lead = {
          id: body.id || 'lead_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
          name: String(body.name).trim(),
          phone: String(body.phone).trim(),
          telegram: body.telegram ? String(body.telegram).trim() : '',
          service: body.service || 'custom',
          message: body.message ? String(body.message).trim() : '',
          createdAt: body.createdAt || new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' }),
          status: body.status || 'new',
          notes: body.notes || '',
        }

        // Avoid duplicates by id or same phone + name
        const exists = (globalThis as any).__GME_LEADS__.some((l: any) => l.id === lead.id)
        if (!exists) {
          ;(globalThis as any).__GME_LEADS__.unshift(lead)
        }

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ ok: true, lead }))
        return
      }

      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Noto‘g‘ri ma’lumot' }))
    } catch (err) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Server xatosi' }))
    }
    return
  }

  res.statusCode = 405
  res.end('Method Not Allowed')
}
