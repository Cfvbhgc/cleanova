import { marquee } from '../content'

export function Marquee({ tone, reverse = false }: { tone: 'dark' | 'light'; reverse?: boolean }) {
  const line = marquee.map((t) => `${t} // `).join('')
  return (
    <div
      aria-hidden
      className={`overflow-hidden py-5 select-none ${tone === 'dark' ? 'bg-bark text-[oklch(0.7_0.01_95)]' : 'bg-cream text-sage-deep'}`}
    >
      <div
        className="marquee-track flex w-max text-[clamp(1.5rem,3.6vw,2.6rem)] font-semibold whitespace-nowrap uppercase"
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        <span className="pr-3">{line}</span>
        <span className="pr-3">{line}</span>
      </div>
    </div>
  )
}
