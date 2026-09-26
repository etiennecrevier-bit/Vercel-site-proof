'use client'

import type { ReactNode } from 'react'
import { ArrowRight, Check, CircleAlert, ShieldCheck } from 'lucide-react'
import type { Queue, SectionId } from '@/lib/dashboard-data'
import { useT } from '@/lib/dashboard-i18n'
import { FakeLink } from './fake-link'

export function SectionCard({
  id,
  href,
  adminOnly,
  className = '',
  children,
}: {
  id: SectionId
  href: string
  adminOnly?: boolean
  className?: string
  children: ReactNode
}) {
  const { t } = useT()
  const hint = t.sectionHints[id]
  return (
    <section aria-labelledby={`sec-${id}`} className={`flex flex-col overflow-hidden rounded-lg border border-border bg-card ${className}`}>
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h2 id={`sec-${id}`} className="flex items-center gap-2 text-base font-semibold text-foreground">
            {t.sections[id]}
            {adminOnly && <AdminChip />}
          </h2>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <FakeLink href={href} className="shrink-0 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline">
          {t.openSection}
        </FakeLink>
      </div>
      {children}
    </section>
  )
}

export function AdminChip() {
  const { t } = useT()
  return (
    <span className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground ring-1 ring-border">
      <ShieldCheck className="size-3" aria-hidden />
      {t.adminOnly}
    </span>
  )
}

export function QueueList({ queues, tone = 'attention' }: { queues: Queue[]; tone?: 'attention' | 'destructive' }) {
  const { t } = useT()
  const parentEmpty = new Set<number>()
  const rows = queues.filter((q, i) => {
    if (!q.sub) {
      if (q.count === 0) parentEmpty.add(i)
      return true
    }
    // "dont …" rows only appear when they carry something
    return q.count !== 0 && !parentEmpty.has(i - 1)
  })

  if (rows.every((q) => q.count === 0)) {
    return (
      <p className="flex items-center gap-2 px-4 py-3 text-sm text-success-foreground">
        <Check className="size-4" aria-hidden />
        {t.nothingPending}
      </p>
    )
  }

  return (
    <ul className="divide-y divide-border">
      {rows.map((q) => (
        <li key={q.id}>
          <QueueRow queue={q} tone={tone} />
        </li>
      ))}
    </ul>
  )
}

function QueueRow({ queue: q, tone }: { queue: Queue; tone: 'attention' | 'destructive' }) {
  const { t } = useT()
  const copy = t.queues[q.id]

  if (q.count === 0) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 text-sm">
        <span className="flex w-10 shrink-0 justify-end">
          <Check className="size-4 text-success" aria-hidden />
        </span>
        <span className="min-w-0 flex-1 truncate text-muted-foreground">{copy.label}</span>
        <span className="shrink-0 text-success-foreground">{t.nothingPending}</span>
      </div>
    )
  }

  const unavailable = q.count === null
  const countTone = unavailable ? 'text-muted-foreground' : tone === 'destructive' ? 'text-destructive' : 'text-attention-foreground'

  let meta: ReactNode = null
  if (unavailable) {
    meta = (
      <span className="inline-flex items-center gap-1 text-muted-foreground">
        <CircleAlert className="size-3.5" aria-hidden />
        {t.unavailable}
      </span>
    )
  } else if (q.detail === 'expires' && q.expiresMin !== undefined) {
    meta = t.expiresIn(t.age(q.expiresMin))
  } else if (q.detail !== 'age-value' && q.oldestMin !== null) {
    meta = t.oldest(t.age(q.oldestMin))
  }

  const value = unavailable ? '—' : q.detail === 'age-value' && q.oldestMin !== null ? t.age(q.oldestMin) : q.count

  return (
    <FakeLink
      href={q.href}
      className={[
        'group flex items-center gap-3 px-4 transition-colors hover:bg-muted/70 focus-visible:bg-muted/70 focus-visible:outline-none',
        q.sub ? 'py-2' : 'py-3',
      ].join(' ')}
    >
      <span
        className={[
          'tnum shrink-0 text-right font-semibold leading-none',
          q.detail === 'age-value' ? 'min-w-10 text-base' : 'w-10',
          q.sub ? 'text-base' : 'text-xl',
          countTone,
        ].join(' ')}
      >
        {value}
      </span>
      <span className={['flex min-w-0 flex-1 flex-col', q.sub ? 'pl-3' : ''].join(' ')}>
        <span className={['text-pretty leading-snug', q.sub ? 'text-sm text-muted-foreground' : 'text-sm font-medium text-foreground'].join(' ')}>
          {copy.label}
        </span>
        {meta && <span className="tnum text-xs text-muted-foreground">{meta}</span>}
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
        <span className={q.sub ? 'sr-only @md:not-sr-only' : ''}>{copy.verb}</span>
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </FakeLink>
  )
}
