'use client'

import { Building2 } from 'lucide-react'
import { useDir } from '@/lib/directory-i18n'
import type { FlatReport } from '@/lib/interventions-data'
import { unsentCount } from '@/lib/interventions-data'
import { ReportRow, ToSendPill } from './shared'

export function ReportsView({ reports }: { reports: FlatReport[] }) {
  const { t } = useDir()

  if (reports.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center text-muted-foreground">
        {t.ivNoResults}
      </div>
    )
  }

  // Group by client, preserving first-seen order.
  const groups = new Map<string, FlatReport[]>()
  for (const r of reports) {
    const list = groups.get(r.clientName) ?? []
    list.push(r)
    groups.set(r.clientName, list)
  }

  return (
    <div className="space-y-8">
      {[...groups.entries()].map(([client, list]) => {
        const toSend = unsentCount(list)
        return (
          <section key={client}>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-foreground">
                <Building2 className="size-5 text-primary" aria-hidden />
                {client}
              </h2>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {t.ivReportsN(list.length)}
              </span>
              <ToSendPill n={toSend} />
            </div>
            <div className="space-y-2">
              {list.map((r) => (
                <ReportRow key={r.id} report={r} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
