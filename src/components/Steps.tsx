import { steps } from '../content'

export function Steps() {
  return (
    <section id="kak" aria-labelledby="kak-title" className="bg-sage py-16 sm:py-24">
      <div className="wrap">
        <h2 id="kak-title" className="display reveal text-center text-[clamp(1.75rem,4.4vw,2.85rem)] text-bark">
          Как всё проходит
        </h2>
        <ol className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
          <span aria-hidden className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-px bg-bark/25 md:block" />
          {steps.map((s, i) => (
            <li key={s.title} className="reveal relative flex gap-5 md:flex-col md:items-center md:text-center">
              <span className="display tnum relative z-10 grid size-14 shrink-0 place-items-center rounded-full bg-paper text-xl text-bark">
                {i + 1}
              </span>
              <div>
                <h3 className="text-xl font-semibold text-bark md:mt-5">{s.title}</h3>
                <p className="mt-2 max-w-[17rem] text-[16px] leading-relaxed text-bark/85">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
