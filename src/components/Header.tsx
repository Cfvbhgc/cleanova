import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ListIcon, PhoneIcon, XIcon } from '@phosphor-icons/react'
import { company, nav as allNav, reviews } from '../content'

const nav = reviews.length ? allNav : allNav.filter((item) => item.href !== '#otzyvy')

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className="flex min-h-11 items-center gap-2.5">
      <span
        className={`display grid size-11 place-items-center rounded-[14px] text-xl ${
          light ? 'bg-cream text-bark' : 'bg-moss text-cream'
        }`}
        aria-hidden
      >
        c
      </span>
      <span className={`display text-lg font-bold ${light ? 'text-cream' : 'text-bark'}`}>cleanova</span>
    </a>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="wrap flex h-20 items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Разделы" className="hidden lg:block">
          <ul className="flex gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="flex min-h-11 items-center rounded-full px-3.5 text-[15px] text-bark transition-colors hover:bg-paper/40"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={company.phoneHref}
            className="tnum hidden min-h-11 items-center px-2 text-[15px] font-medium text-bark md:flex"
          >
            {company.phone}
          </a>
          <a href="#zayavka" className="pill hidden bg-moss text-[15px] text-cream hover:bg-bark lg:inline-flex">
            Оставить заявку
          </a>
          <a
            href={company.phoneHref}
            aria-label={`Позвонить: ${company.phone}`}
            className="grid size-11 place-items-center rounded-[14px] bg-moss text-cream md:hidden"
          >
            <PhoneIcon size={20} weight="bold" />
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Открыть меню"
            aria-expanded={open}
            aria-controls="menu"
            className="grid size-11 cursor-pointer place-items-center rounded-[14px] bg-paper text-bark lg:hidden"
          >
            <ListIcon size={22} weight="bold" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            className="on-dark fixed inset-0 z-50 flex flex-col bg-bark text-cream"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="wrap flex h-20 items-center justify-between">
              <Logo light />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть меню"
                className="grid size-11 cursor-pointer place-items-center rounded-[14px] bg-cream text-bark"
                autoFocus
              >
                <XIcon size={22} weight="bold" />
              </button>
            </div>
            <nav aria-label="Разделы" className="wrap flex flex-1 flex-col justify-center">
              <ul className="space-y-1">
                {nav.map((item, i) => (
                  <m.li
                    key={item.href}
                    initial={{ opacity: 0, transform: 'translateY(16px)' }}
                    animate={{ opacity: 1, transform: 'translateY(0px)' }}
                    transition={{ delay: 0.04 * i + 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="display flex min-h-14 items-center text-[clamp(1.75rem,8vw,2.5rem)]"
                    >
                      {item.label}
                    </a>
                  </m.li>
                ))}
              </ul>
            </nav>
            <div className="wrap space-y-3 pb-8">
              <a href={company.phoneHref} className="tnum flex min-h-11 items-center text-xl font-medium">
                {company.phone}
              </a>
              <a
                href="#zayavka"
                onClick={() => setOpen(false)}
                className="pill w-full bg-cream text-bark"
              >
                Оставить заявку
              </a>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
