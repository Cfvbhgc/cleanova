import { ArrowRightIcon } from '@phosphor-icons/react'
import { heroCards } from '../content'
import { pickService } from '../lib/pick'
import { Picture } from './Picture'

const WORD = 'чисто'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-sage pt-20">
      <div className="wrap grid gap-x-8 pb-10 lg:grid-cols-[minmax(0,1fr)_9.5rem] lg:pb-14">
        <div className="relative">
          <Picture
            name="hero-chair"
            widths={[560, 900, 1300]}
            sizes="(min-width: 1024px) 640px, (min-width: 640px) 80vw, 94vw"
            alt="Изумрудное бархатное кресло с белой подушкой"
            width={1300}
            height={867}
            eager
            className="anim-settle mx-auto mt-[10vw] block w-[94%] sm:mt-[8vw] sm:w-[80%] lg:mt-6 lg:w-[64%]"
            imgClassName="h-auto w-full"
          />
          <p
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 flex justify-center select-none sm:top-[4%] lg:top-[24%]"
          >
            <span className="relative font-display text-[clamp(4.6rem,22.5vw,10.75rem)] leading-[0.9] font-[900] tracking-[-0.055em] text-paper">
              {WORD.split('').map((ch, i) => (
                <span key={i} className="anim-rise inline-block" style={{ animationDelay: `${120 + i * 60}ms` }}>
                  {ch}
                </span>
              ))}
              <span
                className="anim-rise absolute right-[0.06em] -bottom-[0.32em] font-sans text-[0.22em] font-light tracking-normal text-paper"
                style={{ animationDelay: '520ms' }}
              >
                клининг
              </span>
            </span>
          </p>
        </div>

        <aside aria-label="Популярные услуги" className="mt-6 lg:mt-4">
          <ul className="grid grid-cols-3 gap-2.5 sm:gap-4 lg:grid-cols-1">
            {heroCards.map((card, i) => (
              <li key={card.title} className="anim-rise" style={{ animationDelay: `${450 + i * 80}ms` }}>
                <button
                  type="button"
                  onClick={() => pickService(card.target)}
                  className="group relative block w-full cursor-pointer rounded-[22px] bg-paper p-1.5 text-left shadow-[0_10px_30px_-18px_oklch(0.3_0.05_120/0.6)] transition-transform duration-200 ease-out active:scale-[0.97]"
                >
                  <span className="absolute top-2.5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-bark px-2 py-0.5 text-[10px] whitespace-nowrap text-cream sm:text-[11px]">
                    {card.price}
                  </span>
                  <Picture
                    name={card.image}
                    widths={[200, 400]}
                    sizes="(min-width: 1024px) 140px, 30vw"
                    alt=""
                    width={400}
                    height={400}
                    imgClassName="aspect-square w-full rounded-[16px] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    className="block overflow-hidden rounded-[16px]"
                  />
                  <span className="block py-1.5 text-center text-sm font-medium text-bark">{card.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div
          className="anim-rise mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between lg:col-span-2 lg:mt-0 lg:justify-end lg:gap-10"
          style={{ animationDelay: '650ms' }}
        >
          <h1 className="max-w-[22rem] text-[17px] leading-snug text-bark sm:text-base lg:text-right">
            Уборка квартир, офисов и химчистка мебели в Москве. Приедем уже завтра.
          </h1>
          <a href="#zayavka" className="pill min-h-12 bg-cocoa px-6 text-cream hover:bg-bark">
            Оставить заявку
            <ArrowRightIcon size={18} weight="bold" />
          </a>
        </div>
      </div>
    </section>
  )
}
