import { ArrowCounterClockwiseIcon, CameraIcon, ReceiptIcon, SprayBottleIcon } from '@phosphor-icons/react'
import { advantages } from '../content'

const icons = [ReceiptIcon, SprayBottleIcon, CameraIcon]

export function Advantages() {
  return (
    <section aria-labelledby="why-title" className="bg-cream pt-16 pb-8 sm:pt-24">
      <div className="wrap">
        <h2 id="why-title" className="display reveal max-w-[40rem] text-[clamp(1.75rem,4.4vw,2.85rem)] text-cocoa">
          {advantages.title}
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
          <div className="reveal flex flex-col justify-between gap-10 rounded-[32px] bg-sage p-7 sm:p-9 lg:row-span-2">
            <ArrowCounterClockwiseIcon size={40} weight="regular" className="text-bark" aria-hidden />
            <div>
              <h3 className="display text-[clamp(1.45rem,2.6vw,1.9rem)] text-bark">{advantages.main.title}</h3>
              <p className="mt-4 text-[17px] leading-relaxed text-bark">{advantages.main.text}</p>
            </div>
          </div>
          {advantages.items.map((a, i) => {
            const Icon = icons[i]
            return (
              <div
                key={a.title}
                className={`reveal rounded-[32px] bg-paper p-7 sm:p-8 ${i === 2 ? 'md:col-span-2 lg:flex lg:items-start lg:gap-8' : ''}`}
              >
                <Icon size={30} className="shrink-0 text-moss" aria-hidden />
                <div>
                  <h3 className={`mt-5 text-xl font-semibold text-bark ${i === 2 ? 'lg:mt-0' : ''}`}>{a.title}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-muted">{a.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
