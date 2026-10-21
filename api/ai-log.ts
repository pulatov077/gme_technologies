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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')

  if (req.method === 'OPTIONS') {
    res.statusCode = 200
    res.end()
    return
  }

  // Do not send AI messages to Telegram group chat.
  // AI conversations are confidential and only accessible in Admin Panel and bot password prompt.
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ ok: true, confidential: true }))
}
