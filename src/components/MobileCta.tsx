import { useEffect, useState } from 'react'
import { PhoneIcon } from '@phosphor-icons/react'
import { company } from '../content'

export function MobileCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    const form = document.getElementById('zayavka')
    if (!hero || !form) return
    const state = { hero: true, form: false }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) state.hero = e.isIntersecting
        if (e.target === form) state.form = e.isIntersecting
      }
      setVisible(!state.hero && !state.form)
    })
    io.observe(hero)
    io.observe(form)
    return () => io.disconnect()
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 flex gap-2 bg-gradient-to-t from-cream/90 to-transparent px-4 pt-6 pb-[max(1rem,env(safe-area-inset-bottom))] transition-[opacity,transform] duration-300 ease-[var(--ease-out)] md:hidden ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
      inert={!visible}
    >
      <a href="#zayavka" className="pill min-h-13 flex-1 bg-cocoa text-[17px] text-cream shadow-[0_12px_30px_-12px_oklch(0.3_0.04_50/0.7)]">
        Оставить заявку
      </a>
      <a
        href={company.phoneHref}
        aria-label={`Позвонить: ${company.phone}`}
        className="grid size-13 shrink-0 place-items-center rounded-full bg-moss text-cream"
      >
        <PhoneIcon size={22} weight="bold" />
      </a>
    </div>
  )
}
