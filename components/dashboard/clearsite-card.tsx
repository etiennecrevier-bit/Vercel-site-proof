'use client'

import { ArrowRight } from 'lucide-react'
import { CLEARSITE_HREF, CLEARSITE_MISSING_HREF, type DashboardData, type Role, type VisitState } from '@/lib/dashboard-data'
import { useT } from '@/lib/dashboard-i18n'
import { FakeLink } from './fake-link'
import { AdminChip, QueueList, SectionCard } from './queue-section'

const ORDER: VisitState[] = ['received', 'anomaly', 'missing', 'pending', 'excused']
const SWATCH: Record<VisitState, string> = {
  received: 'bg-success',
  anomaly: 'bg-attention',
  missing: 'bg-destructive',
  pending: 'bg-primary/30',
  excused: 'bg-muted-foreground/25',
}

export function ClearSiteCard({ data, role, className }: { data: DashboardData; role: Role; className?: string }) {
  const { t } = useT()
  const total = ORDER.reduce((a, s) => a + data.visits[s], 0)
  const aria = ORDER.map((s) => `${t.visit[s]} ${data.visits[s]}`).join(', ')

  return (
    <SectionCard id="clearsite" href={CLEARSITE_HREF} className={className}>
      <div className="grid gap-6 p-4 @4xl:grid-cols-5">
        <div className="flex flex-col gap-3 @4xl:col-span-3">
          <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
            <span className="tnum font-medium text-foreground">{t.visitsPlanned(total)}</span>
            <span className="tnum text-xs text-muted-foreground">{t.notRequired(data.notRequired)}</span>
          </p>

          <div role="img" aria-label={aria} className="flex h-4 w-full gap-0.5 overflow-hidden rounded-sm">
            {ORDER.filter((s) => data.visits[s] > 0).map((s) => (
              <span key={s} className={SWATCH[s]} style={{ width: `${(data.visits[s] / total) * 100}%` }} />
            ))}
          </div>

          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 @md:grid-cols-3 @2xl:grid-cols-5">
            {ORDER.map((s) => (
              <li key={s}>
                <FakeLink
                  href={`${CLEARSITE_HREF}&etat=${s}`}
                  className="flex items-center gap-2 rounded-sm text-sm hover:text-primary"
                >
                  <span className={`size-2.5 shrink-0 rounded-sm ${SWATCH[s]}`} aria-hidden />
                  <span className="text-muted-foreground">{t.visit[s]}</span>
                  <span className={`tnum ml-auto font-semibold @2xl:ml-0 ${s === 'missing' && data.visits[s] > 0 ? 'text-destructive' : 'text-foreground'}`}>
                    {data.visits[s]}
                  </span>
                </FakeLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 @4xl:col-span-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.mostLate}</h3>
          {data.missing.length === 0 ? (
            <p className="text-sm text-success-foreground">{t.nothingPending}</p>
          ) : (
            <ol className="flex flex-col divide-y divide-border rounded-md border border-border">
              {data.missing.map((m) => (
                <li key={m.building}>
                  <FakeLink href={m.href} className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-muted/70">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-foreground">{m.building}</span>
                      <span className="tnum text-xs text-muted-foreground">{t.deadline(t.clock(m.deadlineMin))}</span>
                    </span>
                    <span className="tnum shrink-0 text-sm font-semibold text-destructive">+{t.age(m.lateMin)}</span>
                  </FakeLink>
                </li>
              ))}
            </ol>
          )}
          {data.visits.missing > data.missing.length && (
            <FakeLink href={CLEARSITE_MISSING_HREF} className="inline-flex items-center gap-1 self-start text-sm font-medium text-primary">
              {t.seeAllMissing(data.visits.missing)}
              <ArrowRight className="size-4" aria-hidden />
            </FakeLink>
          )}
        </div>
      </div>

      {role === 'admin' && (
        <div className="border-t border-border">
          <div className="flex items-center gap-2 px-4 pt-3 text-xs text-muted-foreground">
            <AdminChip />
          </div>
          <QueueList queues={[data.queues.proofsToAttach]} />
        </div>
      )}
    </SectionCard>
  )
}
