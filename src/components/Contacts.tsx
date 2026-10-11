import { useEffect, useRef, useState } from 'react'
import { ClockIcon, EnvelopeSimpleIcon, MapPinIcon, PhoneIcon, TelegramLogoIcon } from '@phosphor-icons/react'
import { company } from '../content'

const mapSrc = 'https://yandex.ru/map-widget/v1/?ll=37.6176%2C55.7520&z=10&lang=ru_RU'

export function Contacts() {
  const box = useRef<HTMLDivElement>(null)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowMap(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section id="kontakty" aria-labelledby="kontakty-title" className="bg-cream py-16 sm:py-24">
      <div className="wrap">
        <h2 id="kontakty-title" className="display reveal text-[clamp(1.75rem,4.4vw,2.85rem)] text-cocoa">
          Контакты
        </h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)]">
          <div className="on-dark flex flex-col rounded-[32px] bg-bark p-7 text-cream sm:p-9">
            <ul className="space-y-4 text-[16px] leading-snug">
              <li className="flex gap-3">
                <MapPinIcon size={22} className="mt-px shrink-0 text-sage" aria-hidden />
                <span>
                  {company.area}
                  <span className="mt-1 block text-[15px] text-[oklch(0.8_0.008_95)]">{company.address}</span>
                </span>
              </li>
              <li className="flex gap-3">
                <ClockIcon size={22} className="mt-px shrink-0 text-sage" aria-hidden />
                {company.hours}
              </li>
            </ul>
            <div className="mt-8 space-y-1 border-t border-[oklch(0.4_0.006_95)] pt-6 lg:mt-auto">
              <a href={company.phoneHref} className="tnum flex min-h-11 items-center gap-3 text-xl font-medium">
                <PhoneIcon size={22} className="text-sage" aria-hidden />
                {company.phone}
              </a>
              <a href={`mailto:${company.email}`} className="flex min-h-11 items-center gap-3">
                <EnvelopeSimpleIcon size={22} className="text-sage" aria-hidden />
                {company.email}
              </a>
              {company.telegram && (
                <a href={company.telegram} target="_blank" rel="noopener" className="flex min-h-11 items-center gap-3">
                  <TelegramLogoIcon size={22} className="text-sage" aria-hidden />
                  Написать в Telegram
                </a>
              )}
            </div>
          </div>
          <div ref={box} className="relative h-[22rem] overflow-hidden rounded-[32px] bg-sage sm:h-[28rem]">
            {showMap ? (
              <iframe
                src={mapSrc}
                title="Карта Москвы: зона выезда Cleanova"
                className="absolute inset-0 size-full border-0"
                loading="lazy"
              />
            ) : (
              <p className="grid size-full place-items-center px-6 text-center text-bark">{company.area}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
