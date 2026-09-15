'use client'

import type { ReactNode } from 'react'
import {
  Activity,
  Check,
  ChevronRight,
  ClipboardList,
  Clock,
  Images,
  Lock,
  MailWarning,
  MailX,
  Send,
  TriangleAlert,
} from 'lucide-react'
import { INDICATORS, type Indicator, type IndicatorKey } from '@/lib/health-data'
import { useDir } from '@/lib/directory-i18n'
import { AppShell } from './app-shell'

const ICONS: Record<IndicatorKey, typeof Activity> = {
  openNoReport: ClipboardList,
  inboxPhotos: Images,
  errors7d: MailWarning,
  stuck: Clock,
  reportsNotSent: Send,
  emailsFailed: MailX,
}

function labelFor(key: IndicatorKey, t: ReturnType<typeof useDir>['t']) {
  switch (key) {
    case 'openNoReport':
      return t.hOpenNoReport
    case 'inboxPhotos':
      return t.hInboxPhotos
    case 'errors7d':
      return t.hErrors7d
    case 'stuck':
      return t.hStuck
    case 'reportsNotSent':
      return t.hReportsNotSent
    case 'emailsFailed':
      return t.hEmailsFailed
  }
}

function Chip({ children, tone }: { children: ReactNode; tone: 'attention' | 'neutral' }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        tone === 'attention'
          ? 'bg-attention-muted text-attention-foreground'
          : 'border border-border text-muted-foreground',
      ].join(' ')}
    >
      {children}
    </span>
  )
}

function IndicatorCard({ ind }: { ind: Indicator }) {
  const { t } = useDir()
  const Icon = ICONS[ind.key]
  const label = labelFor(ind.key, t)
  const remainder = ind.total - ind.rows.length
  const display = ind.windowed && ind.total >= 200 ? '200+' : String(ind.total)

  return (
    <section className="mb-4 flex break-inside-avoid flex-col rounded-lg border border-border bg-card">
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <h2 className="text-pretty text-sm font-semibold text-foreground">{label}</h2>
        </div>
        <span
          className="tnum shrink-0 text-2xl font-bold leading-none text-attention-foreground"
          aria-label={`${ind.total}`}
        >
          {display}
        </span>
      </div>

      <ul className="divide-y divide-border px-4">
        {ind.rows.map((row) => {
          const content = (
            <>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-foreground">{row.primary}</div>
                <div className="truncate text-xs text-muted-foreground">{row.secondary}</div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="tnum whitespace-nowrap text-xs text-muted-foreground">{t.ago(row.ageMin)}</span>
                {row.jobId ? (
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground" aria-hidden />
                ) : null}
              </div>
            </>
          )
          return (
            <li key={row.id}>
              {row.jobId ? (
                <a
                  href={`/interventions/${row.jobId}`}
                  className="group -mx-2 flex items-center justify-between gap-3 rounded px-2 py-2.5 hover:bg-secondary/60 focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                  {content}
                </a>
              ) : (
                <div className="flex items-center justify-between gap-3 py-2.5">{content}</div>
              )}
            </li>
          )
        })}
      </ul>

      {ind.windowed || remainder > 0 ? (
        <div className="flex flex-col gap-1 border-t border-border px-4 py-2.5">
          {remainder > 0 ? (
            <span className="text-xs font-medium text-attention-foreground">{t.healthAndMore(remainder)}</span>
          ) : null}
          {ind.windowed ? <span className="text-xs text-muted-foreground">{t.healthWindowNote}</span> : null}
        </div>
      ) : null}
    </section>
  )
}

export function HealthDashboard() {
  const { t } = useDir()

  const attention = INDICATORS.filter((i) => i.total > 0)
  const clear = INDICATORS.filter((i) => i.total === 0)

  return (
    <AppShell active="health">
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-pretty text-2xl font-bold tracking-tight text-foreground">{t.healthTitle}</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <Lock className="size-3" aria-hidden />
            {t.healthReadOnly}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {t.healthAdminOnly}
          </span>
        </div>
        <p className="mt-1 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">{t.healthSubtitle}</p>
      </div>

      {/* Verdict d'un coup d'œil */}
      <div
        className={[
          'mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3',
          attention.length > 0 ? 'border-attention/40 bg-attention-muted' : 'border-success/40 bg-success-muted',
        ].join(' ')}
      >
        <div className="flex items-center gap-2">
          {attention.length > 0 ? (
            <TriangleAlert className="size-4 text-attention-foreground" aria-hidden />
          ) : (
            <Check className="size-4 text-success-foreground" aria-hidden />
          )}
          <span
            className={[
              'text-sm font-semibold',
              attention.length > 0 ? 'text-attention-foreground' : 'text-success-foreground',
            ].join(' ')}
          >
            {attention.length > 0 ? t.healthNeedAction(attention.length) : t.healthAllGood}
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Activity className="size-3.5" aria-hidden />
          {t.healthAsOf}
        </span>
      </div>

      {attention.length > 0 ? (
        <>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.healthOldest}</p>
          <div className="columns-1 gap-4 lg:columns-2">
            {attention.map((ind) => (
              <IndicatorCard key={ind.key} ind={ind} />
            ))}
          </div>
        </>
      ) : null}

      {clear.length > 0 ? (
        <section className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-2.5">
            <Check className="size-4 text-success-foreground" aria-hidden />
            <h2 className="text-sm font-bold text-foreground">{t.healthClearGroup}</h2>
          </div>
          <ul className="divide-y divide-border">
            {clear.map((ind) => {
              const Icon = ICONS[ind.key]
              return (
                <li key={ind.key} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="flex min-w-0 items-center gap-2 text-sm text-foreground">
                    <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    <span className="truncate">{labelFor(ind.key, t)}</span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-success-foreground">
                    <span className="size-1.5 rounded-full bg-success" aria-hidden />
                    <span className="tnum">0</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}
    </AppShell>
  )
}
