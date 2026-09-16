'use client'

import { useMemo, useState } from 'react'
import { ClipboardList, FileText, CalendarDays, Search, GitMerge, Camera, Send, Check } from 'lucide-react'
import { useDir } from '@/lib/directory-i18n'
import {
  BUILDINGS,
  TOTAL_BUILDINGS,
  TOTAL_TO_SEND,
  buildingReports,
  flattenReports,
  unsentCount,
} from '@/lib/interventions-data'
import { ListView } from './list-view'
import { ReportsView } from './reports-view'
import { DateView } from './date-view'

type View = 'list' | 'reports' | 'byDate'

export function InterventionsLog() {
  const { t } = useDir()
  const [view, setView] = useState<View>('list')
  const [query, setQuery] = useState('')
  const [onlyToSend, setOnlyToSend] = useState(false)

  const q = query.trim().toLowerCase()

  const buildings = useMemo(() => {
    return BUILDINGS.filter((b) => {
      if (onlyToSend && unsentCount(buildingReports(b)) === 0) return false
      if (!q) return true
      return (
        b.name.toLowerCase().includes(q) ||
        b.clientName.toLowerCase().includes(q) ||
        (b.city ?? '').toLowerCase().includes(q) ||
        b.visits.some((v) => v.employee.toLowerCase().includes(q))
      )
    })
  }, [q, onlyToSend])

  const reports = useMemo(() => {
    return flattenReports().filter((r) => {
      if (onlyToSend && r.status !== 'not_sent') return false
      if (!q) return true
      return (
        r.site.toLowerCase().includes(q) ||
        r.clientName.toLowerCase().includes(q) ||
        (r.city ?? '').toLowerCase().includes(q) ||
        r.date.includes(q)
      )
    })
  }, [q, onlyToSend])

  const tabs: { key: View; label: string; icon: typeof ClipboardList }[] = [
    { key: 'list', label: t.ivTabList, icon: ClipboardList },
    { key: 'reports', label: t.ivTabReports, icon: FileText },
    { key: 'byDate', label: t.ivTabByDate, icon: CalendarDays },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">{t.ivTitle}</h1>
          <p className="mt-1 max-w-xl text-muted-foreground text-pretty">{t.ivSubtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            <GitMerge className="size-4" aria-hidden />
            {t.ivMerge}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95"
          >
            <Camera className="size-4" aria-hidden />
            {t.ivNewCapture}
          </button>
        </div>
      </div>

      {/* Actionable summary — the worklist framing */}
      <button
        type="button"
        onClick={() => setOnlyToSend((v) => !v)}
        aria-pressed={onlyToSend}
        className={[
          'mb-6 flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
          TOTAL_TO_SEND === 0
            ? 'border-border bg-card'
            : onlyToSend
              ? 'border-attention bg-attention-muted'
              : 'border-attention/40 bg-attention-muted/50 hover:bg-attention-muted',
        ].join(' ')}
      >
        {TOTAL_TO_SEND === 0 ? (
          <>
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-success-muted text-success-foreground">
              <Check className="size-5" aria-hidden />
            </span>
            <span className="font-medium text-foreground">{t.ivAllCaughtUp}</span>
          </>
        ) : (
          <>
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-attention text-primary-foreground">
              <Send className="size-4" aria-hidden />
            </span>
            <span className="text-base font-semibold text-attention-foreground">{t.ivToSendChip(TOTAL_TO_SEND)}</span>
            <span className="ml-auto text-sm font-medium text-attention-foreground">
              {onlyToSend ? t.ivFilterAll : t.ivFilterToSend}
            </span>
          </>
        )}
      </button>

      {/* View tabs */}
      <div className="mb-5 flex flex-wrap gap-1 border-b border-border">
        {tabs.map((tab) => {
          const isActive = tab.key === view
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setView(tab.key)}
              aria-current={isActive ? 'page' : undefined}
              className={[
                '-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium',
                isActive ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              <Icon className="size-4" aria-hidden />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Search (shared across list & reports views) */}
      {view !== 'byDate' ? (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative min-w-64 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={view === 'list' ? t.ivSearchList : t.ivSearchReports}
              className="w-full rounded-md border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          {view === 'list' ? (
            <span className="text-sm text-muted-foreground">{t.ivShownCount(buildings.length, TOTAL_BUILDINGS)}</span>
          ) : null}
        </div>
      ) : null}

      {view === 'list' ? <ListView buildings={buildings} /> : null}
      {view === 'reports' ? <ReportsView reports={reports} /> : null}
      {view === 'byDate' ? <DateView reports={flattenReports()} /> : null}
    </div>
  )
}
