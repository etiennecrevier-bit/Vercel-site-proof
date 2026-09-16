'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { useDir, type Lang } from '@/lib/directory-i18n'
import type { FlatReport } from '@/lib/interventions-data'
import { ReportRow } from './shared'

const LOCALE: Record<Lang, string> = { fr: 'fr-CA', en: 'en-CA', es: 'es' }

/** Parse yyyy-mm-dd as a local date (avoids UTC off-by-one). */
function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}
function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
/** Monday-based day index (0 = Monday). */
function mondayIndex(d: Date): number {
  return (d.getDay() + 6) % 7
}
function startOfWeek(d: Date): Date {
  const s = new Date(d)
  s.setDate(d.getDate() - mondayIndex(d))
  s.setHours(0, 0, 0, 0)
  return s
}
function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(d.getDate() + n)
  return r
}

export function DateView({ reports }: { reports: FlatReport[] }) {
  const { t, lang } = useDir()
  const locale = LOCALE[lang]

  const today = useMemo(() => parseISO('2026-09-16'), [])
  const [granularity, setGranularity] = useState<'day' | 'week'>('week')
  const [anchor, setAnchor] = useState<Date>(today)
  const [calMonth, setCalMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1))

  const reportsByDay = useMemo(() => {
    const map = new Map<string, FlatReport[]>()
    for (const r of reports) {
      const list = map.get(r.date) ?? []
      list.push(r)
      map.set(r.date, list)
    }
    return map
  }, [reports])

  // Range of days currently shown.
  const days = useMemo(() => {
    if (granularity === 'day') return [anchor]
    const s = startOfWeek(anchor)
    return Array.from({ length: 7 }, (_, i) => addDays(s, i))
  }, [granularity, anchor])

  const shown = useMemo(() => days.flatMap((d) => reportsByDay.get(toISO(d)) ?? []), [days, reportsByDay])
  const totalPhotos = shown.reduce((s, r) => s + r.photoCount, 0)

  const rangeLabel = useMemo(() => {
    if (granularity === 'day') return anchor.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    const s = days[0]
    const e = days[days.length - 1]
    return `${s.toLocaleDateString(locale, { day: 'numeric', month: 'short' })} – ${e.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}`
  }, [granularity, anchor, days, locale])

  function step(dir: -1 | 1) {
    setAnchor((a) => addDays(a, dir * (granularity === 'day' ? 1 : 7)))
  }

  // Calendar grid for calMonth.
  const monthGrid = useMemo(() => {
    const first = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1)
    const offset = mondayIndex(first)
    const start = addDays(first, -offset)
    return Array.from({ length: 42 }, (_, i) => addDays(start, i))
  }, [calMonth])

  const weekdayLabels = useMemo(() => {
    const base = startOfWeek(parseISO('2026-09-14')) // a Monday
    return Array.from({ length: 7 }, (_, i) => addDays(base, i).toLocaleDateString(locale, { weekday: 'short' }))
  }, [locale])

  const selectedISO = toISO(anchor)
  const weekISO = new Set(days.map(toISO))

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* Calendar */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCalMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
            aria-label={t.ivPrev}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <span className="text-sm font-semibold capitalize text-foreground">
            {calMonth.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
          </span>
          <button
            type="button"
            onClick={() => setCalMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
            aria-label={t.ivNext}
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase text-muted-foreground">
          {weekdayLabels.map((w, i) => (
            <span key={i} className="py-1">
              {w}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {monthGrid.map((d) => {
            const iso = toISO(d)
            const inMonth = d.getMonth() === calMonth.getMonth()
            const hasReports = reportsByDay.has(iso)
            const isSelected = granularity === 'day' && iso === selectedISO
            const inWeek = granularity === 'week' && weekISO.has(iso)
            return (
              <button
                key={iso}
                type="button"
                onClick={() => {
                  setAnchor(d)
                  setGranularity('day')
                }}
                className={[
                  'relative flex h-9 flex-col items-center justify-center rounded-md text-sm tnum',
                  inMonth ? 'text-foreground' : 'text-muted-foreground/40',
                  isSelected ? 'bg-primary font-semibold text-primary-foreground' : inWeek ? 'bg-secondary' : 'hover:bg-secondary',
                ].join(' ')}
                aria-current={isSelected ? 'date' : undefined}
              >
                {d.getDate()}
                {hasReports && !isSelected ? (
                  <span className="absolute bottom-1 size-1 rounded-full bg-attention" aria-hidden />
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      {/* Day list */}
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-secondary"
          >
            <ChevronLeft className="size-4" aria-hidden /> {t.ivPrev}
          </button>
          <button
            type="button"
            onClick={() => {
              setAnchor(today)
              setCalMonth(new Date(today.getFullYear(), today.getMonth(), 1))
            }}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-secondary"
          >
            {t.ivToday}
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-secondary"
          >
            {t.ivNext} <ChevronRight className="size-4" aria-hidden />
          </button>

          <div className="ml-auto flex items-center rounded-md border border-border p-0.5">
            {(['day', 'week'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGranularity(g)}
                aria-pressed={granularity === g}
                className={[
                  'rounded px-3 py-1 text-sm font-medium',
                  granularity === g ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                {g === 'day' ? t.ivDay : t.ivWeek}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 text-lg font-semibold text-foreground">
            <CalendarDays className="size-5 text-primary" aria-hidden />
            <span className="capitalize">{rangeLabel}</span>
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {t.ivRangeSummary(shown.length, totalPhotos)}
          </span>
        </div>

        <div className="space-y-6">
          {days.map((d) => {
            const iso = toISO(d)
            const list = reportsByDay.get(iso) ?? []
            if (granularity === 'week' && list.length === 0) return null
            return (
              <section key={iso}>
                <h3 className="mb-2 text-sm font-semibold capitalize text-muted-foreground">
                  {d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                {list.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
                    {t.ivEmptyDay}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {list.map((r) => (
                      <ReportRow key={r.id} report={r} showClient />
                    ))}
                  </div>
                )}
              </section>
            )
          })}
          {shown.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center text-muted-foreground">
              {t.ivEmptyDay}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
