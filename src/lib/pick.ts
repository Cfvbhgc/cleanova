import type { CleaningType, ServiceTarget } from '../content'

// Small bridge between the service cards, the calculator and the lead form.

type PickListener = (target: ServiceTarget) => void
type PrefillListener = (draft: LeadDraft) => void

export type LeadDraft = { type: CleaningType; area: number; note: string }

const pickListeners = new Set<PickListener>()
const prefillListeners = new Set<PrefillListener>()

function scrollTo(id: string) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
}

export function onPick(fn: PickListener) {
  pickListeners.add(fn)
  return () => void pickListeners.delete(fn)
}

export function pickService(target: ServiceTarget) {
  pickListeners.forEach((fn) => fn(target))
  scrollTo('ceny')
}

export function onPrefill(fn: PrefillListener) {
  prefillListeners.add(fn)
  return () => void prefillListeners.delete(fn)
}

export function prefillLead(draft: LeadDraft) {
  prefillListeners.forEach((fn) => fn(draft))
  scrollTo('zayavka')
}
