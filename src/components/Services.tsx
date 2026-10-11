import { ArrowRightIcon } from '@phosphor-icons/react'
import { intro, services, type ServiceId } from '../content'
import { orderService } from '../lib/order'
import { Picture } from './Picture'

function OrderButton({ id, title }: { id: ServiceId; title: string }) {
  return (
    <button
      type="button"
      onClick={() => orderService(id)}
      aria-label={`Заказать: ${title.toLowerCase()}`}
      className="pill shrink-0 bg-bark px-5 text-[15px] text-cream hover:bg-cocoa"
    >
      Заказать
      <ArrowRightIcon size={15} weight="bold" aria-hidden />
    </button>
  )
}

export function Services() {
  const [main, extra] = [services.slice(0, 3), services.slice(3)]

  return (
    <section id="uslugi" className="bg-cream py-16 sm:py-24">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
          <h2 className="display reveal text-[clamp(1.75rem,4.4vw,2.85rem)] text-cocoa">{intro.title}</h2>
          <p className="reveal max-w-[34rem] text-[17px] leading-relaxed text-ink lg:pt-2">{intro.text}</p>
        </div>

        <div className="mt-10 grid items-end gap-6 sm:mt-14 lg:grid-cols-2 lg:gap-16">
          <div className="reveal">
            <Picture
              name="strip"
              widths={[640, 1100]}
              sizes="(min-width: 1024px) 560px, 92vw"
              alt={intro.stripAlt}
              width={1100}
              height={262}
              imgClassName="h-24 w-full rounded-full object-cover sm:h-28"
            />
            <p className="mt-4 text-[15px] text-muted">{intro.stripCaption}</p>
          </div>
          <h2 className="display reveal text-[clamp(1.75rem,4.4vw,2.85rem)] text-cocoa">Услуги и цены</h2>
        </div>

        <ul className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {main.map((s) => (
            <li key={s.id} className="reveal flex flex-col">
              <Picture
                name={s.image}
                widths={[420, 760]}
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 46vw, 92vw"
                alt={s.alt}
                width={760}
                height={950}
                imgClassName="aspect-[4/3] w-full rounded-[28px] object-cover sm:aspect-[4/5]"
              />
              <h3 className="mt-5 text-xl font-medium text-bark">{s.title}</h3>
              <p className="mt-2 flex-1 text-[16px] leading-relaxed text-muted">{s.text}</p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="tnum text-xl font-semibold text-bark">{s.price}</span>
                <OrderButton id={s.id} title={s.title} />
              </div>
            </li>
          ))}
        </ul>

        <ul className="mt-12 grid gap-4 lg:grid-cols-2 lg:gap-5">
          {extra.map((s) => (
            <li
              key={s.id}
              className="reveal grid gap-5 rounded-[32px] bg-paper p-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] sm:p-3.5"
            >
              <Picture
                name={s.image}
                widths={[480, 860]}
                sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 92vw"
                alt={s.alt}
                width={860}
                height={688}
                imgClassName="aspect-[5/4] h-full w-full rounded-[24px] object-cover"
              />
              <div className="flex flex-col px-2 pb-2 sm:px-0 sm:py-3 sm:pr-3">
                <h3 className="text-xl font-medium text-bark">{s.title}</h3>
                <p className="mt-2 flex-1 text-[16px] leading-relaxed text-muted">{s.text}</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <span className="tnum text-xl font-semibold text-bark">{s.price}</span>
                  <OrderButton id={s.id} title={s.title} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
