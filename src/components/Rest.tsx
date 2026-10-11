import { rest } from '../content'
import { Marquee } from './Marquee'
import { Picture } from './Picture'

export function Rest() {
  return (
    <section aria-labelledby="rest-title" className="on-dark bg-bark text-cream">
      <Marquee tone="dark" />
      <div className="wrap grid gap-8 pt-6 pb-16 sm:pb-20 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.6fr)] lg:gap-10">
        <Picture
          name="rest"
          widths={[480, 860]}
          sizes="(min-width: 1024px) 400px, 92vw"
          alt={rest.photoAlt}
          width={860}
          height={1049}
          className="reveal"
          imgClassName="aspect-[4/3] w-full rounded-[32px] object-cover sm:aspect-[4/5] lg:h-full"
        />
        <div className="flex flex-col">
          <h2 id="rest-title" className="reveal text-[clamp(1.6rem,3.2vw,2.35rem)] leading-tight font-normal">
            {rest.title}
            <span className="block text-[oklch(0.78_0.008_90)]">{rest.subtitle}</span>
          </h2>
          <p className="reveal mt-5 max-w-[36rem] text-[17px] leading-relaxed text-[oklch(0.86_0.006_90)]">
            {rest.text}
          </p>
          <ul className="reveal mt-8 grid grid-cols-3 gap-2 rounded-[36px] bg-cream px-3 pt-6 pb-4 text-bark sm:gap-6 sm:px-8 lg:mt-auto">
            {rest.tools.map((t) => (
              <li key={t.title} className="flex flex-col items-center text-center">
                <Picture
                  name={t.image}
                  widths={[240, 440]}
                  sizes="(min-width: 1024px) 200px, 30vw"
                  alt={t.alt}
                  width={440}
                  height={t.height}
                  className="flex h-24 items-end sm:h-40"
                  imgClassName="max-h-full w-auto object-contain"
                />
                <span className="mt-3 text-[13px] leading-tight font-medium sm:text-[15px]">{t.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Marquee tone="light" reverse />
    </section>
  )
}
