// +7 (XXX) XXX-XX-XX; accepts typed or pasted numbers starting with 8, 7 or +7
export function formatPhone(raw: string) {
  const masked = raw.startsWith('+7')
  let digits = (masked ? raw.slice(2) : raw).replace(/\D/g, '')
  if (/^[78]/.test(digits) && (digits.length > 10 || !masked)) digits = digits.slice(1)
  digits = digits.slice(0, 10)
  if (!digits) return masked ? '+7 (' : ''
  let out = '+7 (' + digits.slice(0, 3)
  if (digits.length >= 3) out += ') '
  if (digits.length > 3) out += digits.slice(3, 6)
  if (digits.length > 6) out += '-' + digits.slice(6, 8)
  if (digits.length > 8) out += '-' + digits.slice(8, 10)
  return out
}

export const phoneDigits = (value: string) => value.replace(/\D/g, '').slice(1)
