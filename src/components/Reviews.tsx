import { useRef } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, StarIcon } from '@phosphor-icons/react'
import { reviews, reviewsAreTemplates } from '../content'

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`Оценка ${value} из 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon
          key={i}
          size={16}
          weight="fill"
          className={i < value ? 'text-[oklch(0.72_0.14_75)]' : 'text-line'}
          aria-hidden
        />
      ))}
    </span>
  )
}

export function Reviews() {
  const track = useRef<HTMLUListElement>(null)

  if (!reviews.length) return null

  const scroll = (dir: 1 | -1) => {
    const el = track.current
    const card = el?.querySelector('li')
    el?.scrollBy({ left: dir * ((card?.clientWidth ?? 320) + 16), behavior: 'smooth' })
  }

  return (
    <section id="otzyvy" aria-labelledby="otzyvy-title" className="overflow-hidden bg-cream pt-16 sm:pt-24">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="otzyvy-title" className="display reveal text-[clamp(1.75rem,4.4vw,2.85rem)] text-cocoa">
              Отзывы клиентов
            </h2>
            {reviewsAreTemplates && (
              <p className="reveal mt-4 max-w-[34rem] text-[16px] leading-relaxed text-muted">
                Демонстрационный блок. Здесь появятся настоящие отзывы после первых заказов.
              </p>
            )}
          </div>
          {reviews.length > 2 && (
            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                onClick={() => scroll(-1)}
                aria-label="Предыдущие отзывы"
                className="grid size-12 cursor-pointer place-items-center rounded-full border border-line bg-paper text-bark transition-transform active:scale-95"
              >
                <ArrowLeftIcon size={18} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                aria-label="Следующие отзывы"
                className="grid size-12 cursor-pointer place-items-center rounded-full bg-bark text-cream transition-transform active:scale-95"
              >
                <ArrowRightIcon size={18} weight="bold" />
              </button>
            </div>
          )}
        </div>

        <ul
          ref={track}
          className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 md:-mx-8 md:scroll-px-8 md:px-8"
        >
          {reviews.map((r, i) => (
            <li
              key={i}
              className={`flex w-[82vw] max-w-[23rem] shrink-0 snap-start flex-col rounded-[28px] p-6 sm:p-7 ${
                reviewsAreTemplates ? 'border border-dashed border-sage-deep bg-paper/60' : 'bg-paper'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <Stars value={r.rating} />
                <span className="text-sm text-muted">{r.date}</span>
              </div>
              <p className="mt-4 flex-1 text-[16px] leading-relaxed text-ink">{r.text}</p>
              <div className="mt-6 flex items-center gap-3">
                <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-sage font-semibold text-bark">
                  {r.name[0]}
                </span>
                <span>
                  <span className="block font-medium text-bark">{r.name}</span>
                  <span className="block text-sm text-muted">{r.detail}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
