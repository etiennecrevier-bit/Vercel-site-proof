'use client'

import { ArrowRight, CircleAlert, CircleCheck } from 'lucide-react'
import type { Urgent } from '@/lib/dashboard-data'
import { useT } from '@/lib/dashboard-i18n'
import { FakeLink } from './fake-link'

const MAX_CARDS = 4

export function NowStrip({ urgent }: { urgent: Urgent[] }) {
  const { t } = useT()
  const active = urgent.filter((u) => u.count !== 0)
  const cards = active.slice(0, MAX_CARDS)
  const overflow = active.slice(MAX_CARDS)

  return (
    <section aria-labelledby="now-title" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="now-title" className="text-lg font-semibold tracking-tight text-foreground">
          {t.now.title}
        </h2>
        <p className="text-sm text-muted-foreground">{t.now.subtitle}</p>
      </div>

      {cards.length === 0 ? (
        <p className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-success-foreground">
          <CircleCheck className="size-4" aria-hidden />
          {t.now.nothingLate}
        </p>
      ) : (
        <ul className="grid gap-3 @2xl:grid-cols-2 @5xl:grid-cols-4">
          {cards.map((u) => (
            <li key={u.id} className="flex">
              <UrgentCard item={u} />
            </li>
          ))}
        </ul>
      )}

      {overflow.length > 0 && (
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>{t.now.alsoLate}</span>
          {overflow.map((u) => (
            <FakeLink key={u.id} href={u.href} className="font-medium text-attention-foreground underline-offset-4 hover:underline">
              <span className="tnum">{u.count ?? '—'}</span> {t.urgent[u.id](u.count ?? 2)}
            </FakeLink>
          ))}
        </p>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        <span className="font-medium">{t.now.rulesLabel} :</span> {t.now.rules.join(' · ')}
      </p>
    </section>
  )
}

function UrgentCard({ item }: { item: Urgent }) {
  const { t } = useT()
  const unavailable = item.count === null
  const isMissing = item.id === 'clearsiteMissing'
  const countTone = unavailable ? 'text-muted-foreground' : isMissing ? 'text-destructive' : 'text-attention-foreground'
  const frame = unavailable
    ? 'border-dashed border-border bg-card'
    : isMissing
      ? 'border-destructive/30 bg-destructive-muted'
      : 'border-attention/35 bg-attention-muted'

  let detail: React.ReactNode = null
  if (unavailable) {
    detail = (
      <span className="inline-flex items-center gap-1.5">
        <CircleAlert className="size-3.5" aria-hidden />
        {t.unavailable} — {t.unavailableHint}
      </span>
    )
  } else if (item.building && item.deadlineMin !== undefined && item.lateMin !== undefined) {
    detail = (
      <>
        <span className="block truncate font-medium text-foreground">{item.building}</span>
        <span className="tnum">{t.deadlineLate(t.clock(item.deadlineMin), t.age(item.lateMin))}</span>
      </>
    )
  } else if (item.expiresMin !== undefined) {
    detail = <span className="tnum">{t.expiresIn(t.age(item.expiresMin))}</span>
  } else if (item.oldestMin !== undefined) {
    detail = <span className="tnum">{t.oldest(t.age(item.oldestMin))}</span>
  }

  return (
    <FakeLink
      href={item.href}
      className={`group flex w-full flex-col gap-3 rounded-lg border p-4 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${frame}`}
    >
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.sections[item.section].replace(/ du jour| de hoy|Today's /, '')}</span>
      <span className="flex items-baseline gap-2">
        <span className={`tnum text-4xl font-bold leading-none tracking-tight ${countTone}`}>{unavailable ? '—' : item.count}</span>
      </span>
      <span className="text-pretty text-sm font-medium leading-snug text-foreground">{t.urgent[item.id](item.count ?? 2)}</span>
      <span className="min-w-0 text-sm leading-relaxed text-muted-foreground">{detail}</span>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary">
        {t.urgentVerb[item.id]}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </FakeLink>
  )
}
