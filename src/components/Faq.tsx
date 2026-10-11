import { useId, useState } from 'react'
import { PlusIcon } from '@phosphor-icons/react'
import { company, faq } from '../content'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const id = useId()

  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-cream py-16 sm:py-24">
      <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="reveal">
          <h2 id="faq-title" className="display text-[clamp(1.75rem,4.4vw,2.85rem)] text-cocoa">
            Частые вопросы
          </h2>
          <p className="mt-4 max-w-[24rem] text-[17px] leading-relaxed text-muted">
            Не нашли ответ? Позвоните, менеджер на связи {company.hours.toLowerCase()}.
          </p>
          <a href={company.phoneHref} className="tnum mt-4 inline-flex min-h-11 items-center text-xl font-medium text-bark">
            {company.phone}
          </a>
        </div>
        <ul className="reveal divide-y divide-line border-y border-line">
          {faq.map((item, i) => {
            const isOpen = open === i
            return (
              <li key={item.q}>
                <h3>
                  <button
                    type="button"
                    id={`${id}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-6 py-4 text-left text-[17px] font-medium text-bark"
                  >
                    {item.q}
                    <PlusIcon
                      size={20}
                      weight="bold"
                      aria-hidden
                      className={`shrink-0 transition-transform duration-200 ease-out ${isOpen ? 'rotate-45' : ''}`}
                    />
                  </button>
                </h3>
                <div
                  id={`${id}-a${i}`}
                  role="region"
                  aria-labelledby={`${id}-q${i}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out)] ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <p className="max-w-[40rem] pb-5 text-[16px] leading-relaxed text-muted">{item.a}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
