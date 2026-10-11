import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { CheckCircleIcon, CheckIcon, CircleNotchIcon } from '@phosphor-icons/react'
import { company, services, type ServiceId } from '../content'
import { submitLead } from '../lib/lead'
import { onOrder } from '../lib/order'
import { formatPhone, phoneDigits } from '../lib/phone'

type Fields = { name: string; phone: string; service: ServiceId | ''; consent: boolean }
type Errors = Partial<Record<keyof Fields, string>>
type Status = 'idle' | 'sending' | 'sent' | 'failed'

const empty: Fields = { name: '', phone: '', service: '', consent: false }
const order: (keyof Fields)[] = ['name', 'phone', 'service', 'consent']

function validate(f: Fields): Errors {
  const e: Errors = {}
  if (f.name.trim().length < 2) e.name = 'Напишите, как к вам обращаться'
  if (phoneDigits(f.phone).length !== 10) e.phone = 'Нужен номер из 10 цифр после +7'
  if (!f.service) e.service = 'Выберите услугу'
  if (!f.consent) e.consent = 'Без согласия мы не сможем обработать заявку'
  return e
}

export function LeadForm() {
  const [fields, setFields] = useState<Fields>(empty)
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const sending = useRef(false)
  const trap = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(
    () =>
      onOrder((service) => {
        setFields((f) => ({ ...f, service }))
        setStatus((s) => (s === 'sent' ? 'idle' : s))
      }),
    [],
  )

  const errors = validate(fields)
  const show = (k: keyof Fields) => (submitted || touched[k] ? errors[k] : undefined)
  const blur = (k: keyof Fields) => () => setTouched((t) => ({ ...t, [k]: true }))

  const onPhone = (raw: string) =>
    setFields((f) => {
      const prev = phoneDigits(f.phone)
      const backspaceOverMask = raw.length < f.phone.length && phoneDigits(raw) === prev
      return { ...f, phone: backspaceOverMask ? formatPhone('+7' + prev.slice(0, -1)) : formatPhone(raw) }
    })

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (sending.current) return
    setSubmitted(true)

    const firstError = order.find((k) => errors[k])
    if (firstError) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus()
      return
    }

    // bots fill every field, people never see this one
    if (trap.current?.value) {
      setStatus('sent')
      return
    }

    sending.current = true
    setStatus('sending')
    try {
      await submitLead({
        name: fields.name.trim(),
        phone: fields.phone,
        service: services.find((s) => s.id === fields.service)!.title,
        consent: true,
        page: window.location.href,
      })
      setStatus('sent')
    } catch {
      setStatus('failed')
    } finally {
      sending.current = false
    }
  }

  function reset() {
    setFields(empty)
    setTouched({})
    setSubmitted(false)
    setStatus('idle')
  }

  const input =
    'mt-2 block min-h-12 w-full rounded-2xl border bg-cream px-4 text-[16px] text-ink transition-colors placeholder:text-dim focus:border-bark focus:outline-none'
  const border = (k: keyof Fields) => (show(k) ? 'border-error' : 'border-line')
  const serviceTitle = services.find((s) => s.id === fields.service)?.title

  return (
    <section id="zayavka" aria-labelledby="zayavka-title" className="bg-sage py-16 sm:py-24">
      <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div className="reveal">
          <h2 id="zayavka-title" className="display text-[clamp(1.75rem,4.4vw,2.85rem)] text-bark">
            Оставьте заявку, перезвоним за&nbsp;15&nbsp;минут
          </h2>
          <p className="mt-5 max-w-[30rem] text-[17px] leading-relaxed text-bark">
            Уточним площадь и пожелания, назовём стоимость и время приезда. Предоплата не нужна.
          </p>
          <p className="mt-8 text-[15px] text-bark">Или позвоните сами</p>
          <a href={company.phoneHref} className="tnum display inline-flex min-h-11 items-center text-2xl text-bark">
            {company.phone}
          </a>
        </div>

        <div className="rounded-[32px] bg-paper p-6 sm:p-9">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'sent' ? (
              <m.div
                key="sent"
                role="status"
                initial={{ opacity: 0, transform: 'translateY(12px)' }}
                animate={{ opacity: 1, transform: 'translateY(0px)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="flex min-h-[24rem] flex-col items-start justify-center"
              >
                <CheckCircleIcon size={48} weight="fill" className="text-moss" aria-hidden />
                <h3 className="display mt-5 text-2xl text-bark">Заявка отправлена</h3>
                <p className="mt-3 max-w-[26rem] text-[17px] leading-relaxed text-muted">
                  {fields.name.trim() || 'Спасибо'}, перезвоним на {fields.phone || 'указанный номер'} в течение 15 минут в
                  рабочее время.
                </p>
                {serviceTitle && <p className="mt-2 text-[15px] text-muted">{serviceTitle}</p>}
                <button type="button" onClick={reset} className="pill mt-8 border border-line bg-cream text-bark">
                  Отправить ещё одну
                </button>
              </m.div>
            ) : (
              <m.form
                key="form"
                ref={formRef}
                noValidate
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid gap-5"
                aria-describedby={status === 'failed' ? 'lead-failed' : undefined}
              >
                <Field id="lead-name" label="Имя" error={show('name')}>
                  <input
                    id="lead-name"
                    name="name"
                    autoComplete="name"
                    value={fields.name}
                    onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
                    onBlur={blur('name')}
                    aria-invalid={Boolean(show('name'))}
                    aria-describedby={show('name') ? 'lead-name-error' : undefined}
                    className={`${input} ${border('name')}`}
                    placeholder="Анна"
                  />
                </Field>

                <Field id="lead-phone" label="Телефон" error={show('phone')}>
                  <input
                    id="lead-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={fields.phone}
                    onChange={(e) => onPhone(e.target.value)}
                    onFocus={() => !fields.phone && setFields((f) => ({ ...f, phone: '+7 (' }))}
                    onBlur={() => {
                      if (fields.phone === '+7 (') setFields((f) => ({ ...f, phone: '' }))
                      blur('phone')()
                    }}
                    aria-invalid={Boolean(show('phone'))}
                    aria-describedby={show('phone') ? 'lead-phone-error' : undefined}
                    className={`tnum ${input} ${border('phone')}`}
                    placeholder="+7 (900) 123-45-67"
                  />
                </Field>

                <Field id="lead-service" label="Услуга" error={show('service')}>
                  <select
                    id="lead-service"
                    name="service"
                    value={fields.service}
                    onChange={(e) => setFields((f) => ({ ...f, service: e.target.value as ServiceId }))}
                    onBlur={blur('service')}
                    aria-invalid={Boolean(show('service'))}
                    aria-describedby={show('service') ? 'lead-service-error' : undefined}
                    className={`${input} ${border('service')} cursor-pointer ${fields.service ? '' : 'text-muted'}`}
                  >
                    <option value="" disabled>
                      Выберите услугу
                    </option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}, {s.price}
                      </option>
                    ))}
                  </select>
                </Field>

                <div aria-hidden className="sr-only">
                  <label htmlFor="lead-website">Сайт</label>
                  <input ref={trap} id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div>
                  <label className="flex min-h-11 cursor-pointer items-start gap-3 text-[15px] leading-snug text-ink">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={fields.consent}
                      onChange={(e) => setFields((f) => ({ ...f, consent: e.target.checked }))}
                      onBlur={blur('consent')}
                      aria-invalid={Boolean(show('consent'))}
                      aria-describedby={show('consent') ? 'lead-consent-error' : undefined}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg border-2 text-cream transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cocoa ${
                        fields.consent ? 'border-bark bg-bark' : show('consent') ? 'border-error bg-cream' : 'border-muted bg-cream'
                      }`}
                    >
                      {fields.consent && <CheckIcon size={14} weight="bold" />}
                    </span>
                    <span>
                      Согласен на обработку персональных данных по{' '}
                      <a href="privacy.html" target="_blank" className="underline underline-offset-2">
                        политике конфиденциальности
                      </a>
                    </span>
                  </label>
                  {show('consent') && <ErrorText id="lead-consent-error">{show('consent')}</ErrorText>}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="pill min-h-13 w-full bg-cocoa text-[17px] text-cream hover:bg-bark disabled:cursor-wait disabled:opacity-80"
                  >
                    {status === 'sending' ? (
                      <>
                        <CircleNotchIcon size={20} className="animate-spin" aria-hidden />
                        Отправляем
                      </>
                    ) : (
                      'Отправить заявку'
                    )}
                  </button>
                  {status === 'failed' && (
                    <p id="lead-failed" role="alert" className="mt-3 text-[15px] text-error">
                      Заявка не ушла. Попробуйте ещё раз через минуту или позвоните: {company.phone}
                    </p>
                  )}
                </div>
              </m.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-[15px] font-medium text-bark">
        {label}
      </label>
      {children}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  )
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-sm text-error">
      {children}
    </p>
  )
}
