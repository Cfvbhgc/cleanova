import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { CaretLeftIcon, CaretRightIcon, ClockIcon } from '@phosphor-icons/react'
import { beforeAfter, beforeAfterNote } from '../content'
import { Picture } from './Picture'

type Pair = (typeof beforeAfter)[number]

const START = 50
const clamp = (v: number) => Math.min(100, Math.max(0, v))

function Compare({ pair }: { pair: Pair }) {
  const box = useRef<HTMLDivElement>(null)
  const handle = useRef<HTMLDivElement>(null)
  const pos = useRef(START)
  const gesture = useRef<{ id: number; x: number; y: number; dragging: boolean } | null>(null)

  const set = (value: number) => {
    const v = Math.round(clamp(value) * 10) / 10
    pos.current = v
    box.current?.style.setProperty('--pos', `${v}%`)
    handle.current?.setAttribute('aria-valuenow', String(Math.round(v)))
    handle.current?.setAttribute('aria-valuetext', `До ${Math.round(v)}%, после ${100 - Math.round(v)}%`)
  }

  const fromPointer = (clientX: number) => {
    const r = box.current!.getBoundingClientRect()
    set(((clientX - r.left) / r.width) * 100)
  }

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (gesture.current || (e.pointerType === 'mouse' && e.button !== 0)) return
    const onHandle = handle.current!.contains(e.target as Node)
    const immediate = e.pointerType === 'mouse' || onHandle
    gesture.current = { id: e.pointerId, x: e.clientX, y: e.clientY, dragging: immediate }
    if (immediate) {
      e.currentTarget.setPointerCapture(e.pointerId)
      if (!onHandle) fromPointer(e.clientX)
      if (onHandle) e.preventDefault()
    }
  }

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current
    if (!g || g.id !== e.pointerId) return
    if (!g.dragging) {
      const dx = Math.abs(e.clientX - g.x)
      const dy = Math.abs(e.clientY - g.y)
      if (dx < 6 || dx < dy) return
      g.dragging = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    fromPointer(e.clientX)
  }

  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current
    if (!g || g.id !== e.pointerId) return
    if (!g.dragging) fromPointer(e.clientX)
    gesture.current = null
  }

  const onKey = (e: KeyboardEvent) => {
    const step = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -20, PageUp: 20 }[e.key]
    if (step !== undefined) set(pos.current + (e.shiftKey ? step * 2 : step))
    else if (e.key === 'Home') set(0)
    else if (e.key === 'End') set(100)
    else return
    e.preventDefault()
  }

  const img = 'pointer-events-none absolute inset-0 h-full w-full select-none object-cover'
  const tag = 'pointer-events-none absolute top-3 rounded-full px-3 py-1 text-sm font-medium sm:top-4'

  return (
    <div
      ref={box}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={() => (gesture.current = null)}
      onDragStart={(e) => e.preventDefault()}
      style={{ '--pos': `${START}%` } as CSSProperties}
      className="relative aspect-[4/3] cursor-ew-resize touch-pan-y overflow-hidden rounded-[28px] bg-line select-none"
    >
      <Picture
        name={`${pair.image}-after`}
        widths={[640, 1000, 1400]}
        sizes="(min-width: 1024px) 700px, 92vw"
        alt={pair.afterAlt}
        width={1400}
        height={1050}
        imgClassName={img}
      />
      <span className={`${tag} right-3 bg-bark/80 text-cream sm:right-4`}>После</span>

      <div className="absolute inset-0 [clip-path:inset(0_calc(100%-var(--pos))_0_0)]">
        <Picture
          name={`${pair.image}-before`}
          widths={[640, 1000, 1400]}
          sizes="(min-width: 1024px) 700px, 92vw"
          alt={pair.beforeAlt}
          width={1400}
          height={1050}
          imgClassName={img}
        />
        <span className={`${tag} left-3 bg-cream/90 text-bark sm:left-4`}>До</span>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-[var(--pos)] w-0.5 -translate-x-1/2 bg-cream" />
      <div
        ref={handle}
        role="slider"
        tabIndex={0}
        aria-label={`Сравнение до и после: ${pair.tab.toLowerCase()}`}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={START}
        aria-valuetext={`До ${START}%, после ${100 - START}%`}
        onKeyDown={onKey}
        className="absolute top-1/2 left-[var(--pos)] grid size-12 -translate-1/2 cursor-grab touch-none place-items-center rounded-full bg-cream text-bark shadow-[0_6px_20px_oklch(0.255_0.006_100/0.25)] active:cursor-grabbing"
      >
        <span className="flex" aria-hidden>
          <CaretLeftIcon size={16} weight="bold" />
          <CaretRightIcon size={16} weight="bold" />
        </span>
      </div>
    </div>
  )
}

export function BeforeAfter() {
  const [active, setActive] = useState(0)

  if (!beforeAfter.length) return null
  const pair = beforeAfter[Math.min(active, beforeAfter.length - 1)]

  return (
    <section id="do-posle" aria-labelledby="do-posle-title" className="bg-cream pb-16 sm:pb-24">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-6 rounded-[36px] bg-paper p-3 sm:p-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-10">
          <div className="order-2 lg:order-1">
            <Compare key={pair.id} pair={pair} />
          </div>

          <div className="order-1 flex flex-col px-3 pt-5 sm:px-4 lg:order-2 lg:py-6 lg:pr-6 lg:pl-0">
            <h2 id="do-posle-title" className="display reveal text-[clamp(1.75rem,4.4vw,2.85rem)] text-cocoa">
              До и после
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-muted">Потяните ползунок или нажмите на фото.</p>

            {beforeAfter.length > 1 && (
              <div role="group" aria-label="Помещение" className="mt-6 flex flex-wrap gap-2">
                {beforeAfter.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={p.id === pair.id}
                    onClick={() => setActive(i)}
                    className={`pill shrink-0 border text-[15px] ${
                      p.id === pair.id ? 'border-bark bg-bark text-cream' : 'border-line bg-cream text-bark hover:border-bark'
                    }`}
                  >
                    {p.tab}
                  </button>
                ))}
              </div>
            )}

            <div aria-live="polite" className="mt-6 hidden lg:mt-auto lg:block lg:pt-8">
              <Caption pair={pair} />
            </div>
          </div>

          <div className="order-3 px-3 pb-4 sm:px-4 lg:hidden">
            <Caption pair={pair} />
          </div>
        </div>
        <p className="mt-4 text-[14px] text-muted">{beforeAfterNote}</p>
      </div>
    </section>
  )
}

function Caption({ pair }: { pair: Pair }) {
  return (
    <>
      <h3 className="text-xl font-medium text-bark">{pair.title}</h3>
      <p className="mt-2 text-[16px] leading-relaxed text-muted">{pair.text}</p>
      <p className="tnum mt-4 inline-flex items-center gap-2 rounded-full bg-sage/45 px-3.5 py-1.5 text-[15px] font-medium text-bark">
        <ClockIcon size={17} weight="bold" aria-hidden />
        {pair.hours} работы
      </p>
    </>
  )
}
