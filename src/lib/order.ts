import type { ServiceId } from '../content'

type Listener = (service: ServiceId) => void

const listeners = new Set<Listener>()

export function onOrder(fn: Listener) {
  listeners.add(fn)
  return () => void listeners.delete(fn)
}

// Preselects the service in the lead form and brings the form into view
export function orderService(service: ServiceId) {
  listeners.forEach((fn) => fn(service))
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById('zayavka')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  setTimeout(() => document.getElementById('lead-name')?.focus({ preventScroll: true }), reduce ? 0 : 600)
}
