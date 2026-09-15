'use client'

import { Building2, ChevronRight, TriangleAlert } from 'lucide-react'
import { initials, memberFlags, type Member } from '@/lib/directory-data'
import { useDir } from '@/lib/directory-i18n'

export function EmployeeRow({ m, showLeadPath }: { m: Member; showLeadPath?: string }) {
  const { t } = useDir()
  const flags = memberFlags(m)
  const needsInfo = flags.noEmail || flags.noBuilding

  return (
    <div className="group flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-secondary/60">
      {/* Pastille initiales */}
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground tnum"
        aria-hidden
      >
        {initials(m.name)}
      </div>

      {/* Identité + contact */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="truncate text-sm font-semibold text-foreground">{m.name}</span>
          {m.alias ? (
            <span className="truncate text-xs text-muted-foreground">
              {t.recognizedAs} « {m.alias} »
            </span>
          ) : null}
          {showLeadPath ? (
            <span className="truncate text-xs text-muted-foreground">· {showLeadPath}</span>
          ) : null}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <span className="truncate">{m.email ?? '—'}</span>
          <span aria-hidden>·</span>
          <span className="tnum whitespace-nowrap">{m.phone ?? '—'}</span>
        </div>
      </div>

      {/* Signal « à compléter » */}
      {needsInfo ? (
        <span className="hidden items-center gap-1.5 rounded-full bg-attention-muted px-2.5 py-1 text-xs font-medium text-attention-foreground md:inline-flex">
          <TriangleAlert className="size-3.5" aria-hidden />
          {flags.noBuilding ? t.noBuilding : t.noEmail}
        </span>
      ) : null}

      {/* Nombre de bâtiments */}
      <span
        className={[
          'inline-flex min-w-[104px] items-center justify-end gap-1.5 text-xs whitespace-nowrap tnum',
          flags.noBuilding ? 'text-attention-foreground' : 'text-muted-foreground',
        ].join(' ')}
      >
        <Building2 className="size-3.5 shrink-0" aria-hidden />
        {t.buildings(m.buildingsCount)}
      </span>

      <ChevronRight className="size-4 shrink-0 text-muted-foreground/60 group-hover:text-foreground" aria-hidden />
      <span className="sr-only">
        {t.openProfile} {m.name}
      </span>
    </div>
  )
}
