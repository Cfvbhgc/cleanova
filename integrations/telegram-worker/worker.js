// Cloudflare Worker: receives a lead from the site and forwards it to a Telegram chat.
// Secrets: TELEGRAM_BOT_TOKEN. Vars: TELEGRAM_CHAT_ID, ALLOWED_ORIGIN (see wrangler.toml).

const MAX_BODY = 4096

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? ''
    const allowed = (env.ALLOWED_ORIGIN ?? '').split(',').map((s) => s.trim()).filter(Boolean)
    const cors = {
      'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0] ?? '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    }

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
    if (request.method !== 'POST') return json({ error: 'method not allowed' }, 405, cors)
    if (allowed.length && !allowed.includes(origin)) return json({ error: 'forbidden' }, 403, cors)

    const raw = await request.text()
    if (raw.length > MAX_BODY) return json({ error: 'too large' }, 413, cors)

    let lead
    try {
      lead = JSON.parse(raw)
    } catch {
      return json({ error: 'bad json' }, 400, cors)
    }

    const name = clean(lead.name, 80)
    const phone = clean(lead.phone, 32)
    const service = clean(lead.service, 120)
    const digits = phone.replace(/\D/g, '')
    if (name.length < 2 || digits.length !== 11 || !service || lead.consent !== true) {
      return json({ error: 'invalid lead' }, 422, cors)
    }

    const text = [
      '<b>Новая заявка с сайта</b>',
      `Имя: ${escape(name)}`,
      `Телефон: <a href="tel:+${digits}">${escape(phone)}</a>`,
      `Услуга: ${escape(service)}`,
      `Страница: ${escape(clean(lead.page, 300))}`,
    ].join('\n')

    const tg = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    })

    if (!tg.ok) {
      console.error('telegram error', tg.status, await tg.text())
      return json({ error: 'delivery failed' }, 502, cors)
    }
    return json({ ok: true }, 200, cors)
  },
}

function clean(value, max) {
  return String(value ?? '').trim().slice(0, max)
}

function escape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } })
}
