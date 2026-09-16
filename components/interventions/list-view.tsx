'use client'

import { useState } from 'react'
import { ChevronRight, User, Trash2 } from 'lucide-react'
import { useDir } from '@/lib/directory-i18n'
import {
  type BuildingLog,
  buildingLastVisit,
  buildingPhotos,
  buildingReports,
  untreatedCount,
} from '@/lib/interventions-data'
import { PhotoChip, ReportChip, ToTreatPill, StatusPill, ReportActions } from './shared'

function BuildingCard({ building, defaultOpen }: { building: BuildingLog; defaultOpen?: boolean }) {
  const { t } = useDir()
  const [open, setOpen] = useState(!!defaultOpen)

  const reports = buildingReports(building)
  const photos = buildingPhotos(building)
  const toTreat = untreatedCount(reports)
  const lastVisit = buildingLastVisit(building)

  return (
    <div
      className={[
        'overflow-hidden rounded-xl border bg-card',
        toTreat > 0 ? 'border-l-[3px] border-l-attention border-y-border border-r-border' : 'border-border',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-secondary/40"
      >
        <ChevronRight className={['size-5 shrink-0 text-muted-foreground transition-transform', open ? 'rotate-90' : ''].join(' ')} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-semibold text-foreground">{building.name}</p>
          <p className="truncate text-sm text-muted-foreground">
            {building.clientName}
            {building.city ? ` · ${building.city}` : ''}
          </p>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="mr-1 text-xs text-muted-foreground">
            {t.ivLastVisit} : <span className="tnum">{lastVisit}</span>
          </span>
          <PhotoChip n={photos} />
          <ReportChip n={reports.length} />
          <ToTreatPill n={toTreat} />
        </div>
      </button>

      {/* Mobile meta row */}
      <div className="flex flex-wrap items-center gap-2 px-4 pb-3 sm:hidden">
        <PhotoChip n={photos} />
        <ReportChip n={reports.length} />
        <ToTreatPill n={toTreat} />
      </div>

      {open ? (
        <div className="border-t border-border">
          {building.visits.map((visit) => (
            <div key={visit.id} className="border-b border-border px-4 py-3 last:border-b-0">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="tnum text-sm font-semibold text-foreground">{visit.date}</span>
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <User className="size-3.5" aria-hidden />
                  {visit.employee}
                </span>
                <PhotoChip n={visit.photoCount} />
              </div>

              <div className="mt-3 space-y-2">
                {visit.reports.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg bg-secondary/40 px-3 py-2"
                  >
                    <div className="min-w-[13rem] shrink-0">
                      <StatusPill report={r} />
                    </div>
                    <PhotoChip n={r.photoCount} />
                    <div className="ml-auto flex items-center gap-1.5">
                      <ReportActions report={r} />
                      <button
                        type="button"
                        title={t.ivDelete}
                        aria-label={t.ivDelete}
                        className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive-muted hover:text-destructive"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function ListView({ buildings }: { buildings: BuildingLog[] }) {
  const { t } = useDir()

  if (buildings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center text-muted-foreground">
        {t.ivNoResults}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {buildings.map((b, i) => (
        <BuildingCard key={b.id} building={b} defaultOpen={i === 0} />
      ))}
    </div>
  )
}
