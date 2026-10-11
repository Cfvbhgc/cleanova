import { company, nav as allNav, reviews } from '../content'

const nav = reviews.length ? allNav : allNav.filter((item) => item.href !== '#otzyvy')
import { Logo } from './Header'

export function Footer() {
  return (
    <footer className="on-dark bg-bark pt-14 pb-28 text-cream md:pb-12">
      <div className="wrap">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo light />
            <p className="mt-4 max-w-[20rem] text-[15px] leading-relaxed text-[oklch(0.8_0.008_95)]">
              Уборка квартир и офисов, генеральная уборка, уборка после ремонта и мытьё окон в Москве.
            </p>
          </div>
          <nav aria-label="Разделы в подвале">
            <ul className="grid grid-cols-2 gap-x-8 sm:grid-cols-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="flex min-h-11 items-center text-[15px]">
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#zayavka" className="flex min-h-11 items-center text-[15px]">
                  Заявка
                </a>
              </li>
            </ul>
          </nav>
          <div className="space-y-1">
            <a href={company.phoneHref} className="tnum flex min-h-11 items-center text-lg font-medium">
              {company.phone}
            </a>
            <a href={`mailto:${company.email}`} className="flex min-h-11 items-center text-[15px]">
              {company.email}
            </a>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-[oklch(0.4_0.006_95)] pt-6 text-[13px] text-[oklch(0.75_0.008_95)] md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 {company.name}. {company.legal}
          </p>
          <p className="flex flex-wrap items-center gap-x-5">
            <a href="privacy.html" className="flex min-h-11 items-center underline underline-offset-4">
              Политика конфиденциальности
            </a>
            <span>Фото: Pexels</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
