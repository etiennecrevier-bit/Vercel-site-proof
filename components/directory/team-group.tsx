'use client'

import { ChevronDown, HardHat, UserCog, Users, Building2 } from 'lucide-react'
import { initials, type Team } from '@/lib/directory-data'
import { useDir } from '@/lib/directory-i18n'
import { EmployeeRow } from './employee-row'

export function TeamGroup({
  team,
  open,
  onToggle,
}: {
  team: Team
  open: boolean
  onToggle: () => void
}) {
  const { t } = useDir()
  const isSub = team.lead.role === 'sous_traitant'
  const buildingsTotal = team.members.reduce((s, m) => s + m.buildingsCount, 0)

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      {/* En-tête responsable — la ligne forte */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-secondary/50"
      >
        <ChevronDown
          className={['size-4 shrink-0 text-muted-foreground transition-transform', open ? '' : '-rotate-90'].join(' ')}
          aria-hidden
        />

        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground"
          aria-hidden
        >
          {initials(team.lead.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate text-sm font-bold text-foreground">{team.lead.name}</span>
            <span
              className={[
                'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
                isSub ? 'bg-primary/10 text-primary' : 'bg-success-muted text-success-foreground',
              ].join(' ')}
            >
              {isSub ? <HardHat className="size-3" aria-hidden /> : <UserCog className="size-3" aria-hidden />}
              {isSub ? t.roleSubcontractor : t.roleSupervisor}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{team.lead.org}</p>
        </div>

        {/* Agrégats — repères stables à droite */}
        <div className="hidden shrink-0 items-center gap-4 text-xs text-muted-foreground sm:flex">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <Users className="size-3.5" aria-hidden />
            {t.peopleCount(team.members.length)}
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap tnum">
            <Building2 className="size-3.5" aria-hidden />
            {t.buildings(buildingsTotal)}
          </span>
        </div>
      </button>

      {/* Membres — en retrait, reliés par un rail vertical */}
      {open ? (
        <div className="border-t border-border px-3 pb-2 pt-1">
          <div className="ml-5 border-l border-border pl-4">
            {team.members.map((m) => (
              <EmployeeRow key={m.id} m={m} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
