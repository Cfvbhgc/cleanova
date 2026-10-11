export type Lead = {
  name: string
  phone: string
  service: string
  consent: true
  page: string
}

export class LeadError extends Error {}

const endpoint = import.meta.env.VITE_LEAD_ENDPOINT as string | undefined

// Sends the lead as JSON to VITE_LEAD_ENDPOINT. Without it the site runs in demo mode:
// nothing leaves the browser and the form shows the success state.
export async function submitLead(lead: Lead): Promise<void> {
  if (!endpoint) {
    await new Promise((resolve) => setTimeout(resolve, 700))
    return
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      signal: controller.signal,
    })
    if (!res.ok) throw new LeadError(`HTTP ${res.status}`)
  } catch (err) {
    throw err instanceof LeadError ? err : new LeadError(String(err))
  } finally {
    clearTimeout(timer)
  }
}

export const isDemo = !endpoint
