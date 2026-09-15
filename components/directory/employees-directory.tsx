'use client'

import { useMemo, useState } from 'react'
import {
  Search,
  X,
  Plus,
  Network,
  ArrowDownAZ,
  ChevronsDownUp,
  ChevronsUpDown,
  TriangleAlert,
  Users,
} from 'lucide-react'
import { TEAMS, UNASSIGNED, type Member } from '@/lib/directory-data'
import { useDir } from '@/lib/directory-i18n'
import { AppShell } from './app-shell'
import { SubTabs } from './sub-tabs'
import { TeamGroup } from './team-group'
import { EmployeeRow } from './employee-row'

type View = 'team' | 'alpha'
type Filter = 'all' | 'employe' | 'sous_traitant'

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function matches(m: Member, q: string) {
  if (!q) return true
  const hay = normalize([m.name, m.alias ?? '', m.email ?? '', m.phone ?? '', ...m.buildings].join(' '))
  return hay.includes(q)
}

export function EmployeesDirectory() {
  const { t } = useDir()
  const [query, setQuery] = useState('')
  const [view, setView] = useState<View>('team')
  const [filter, setFilter] = useState<Filter>('all')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const q = normalize(query.trim())

  // Filtre par type appliqué au responsable (par équipe) ou au membre (alpha).
  const teams = useMemo(() => {
    return TEAMS.filter((team) => {
      if (filter === 'sous_traitant') return team.lead.role === 'sous_traitant'
      if (filter === 'employe') return team.lead.role === 'superviseur'
      return true
    })
      .map((team) => {
        const leadHit = normalize(team.lead.name + ' ' + team.lead.org).includes(q)
        // Si le responsable correspond, on garde toute son équipe ;
        // sinon on ne garde que les membres qui correspondent.
        return { ...team, members: leadHit ? team.members : team.members.filter((m) => matches(m, q)), leadHit }
      })
      .filter((team) => !q || team.leadHit || team.members.length > 0)
  }, [q, filter])

  const unassigned = useMemo(
    () => UNASSIGNED.filter((m) => matches(m, q)).filter(() => filter !== 'sous_traitant'),
    [q, filter],
  )

  const allMembersAlpha = useMemo(() => {
    const flat: (Member & { path: string })[] = []
    for (const team of TEAMS) {
      for (const m of team.members) flat.push({ ...m, path: team.lead.name })
    }
    for (const m of UNASSIGNED) flat.push({ ...m, path: t.unassignedTitle })
    return flat
      .filter((m) => matches(m, q))
      .filter((m) => (filter === 'sous_traitant' ? m.type === 'sous_traitant' : filter === 'employe' ? m.type === 'employe' : true))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  }, [q, filter, t.unassignedTitle])

  const totalPeople = TEAMS.reduce((s, x) => s + x.members.length, 0) + UNASSIGNED.length
  const needInfoCount =
    TEAMS.reduce((s, x) => s + x.members.filter((m) => m.email === null || m.buildingsCount === 0).length, 0) +
    UNASSIGNED.filter((m) => m.email === null || m.buildingsCount === 0).length

  const anyCollapsed = teams.some((tm) => collapsed[tm.id])
  function setAll(next: boolean) {
    const map: Record<string, boolean> = {}
    for (const tm of TEAMS) map[tm.id] = next
    setCollapsed(map)
  }

  const teamResultCount = teams.reduce((s, tm) => s + tm.members.length, 0) + unassigned.length
  const isEmpty = view === 'team' ? teamResultCount === 0 : allMembersAlpha.length === 0

  return (
    <AppShell>
      {/* Titre */}
      <div className="mb-6">
        <h1 className="text-pretty text-2xl font-bold tracking-tight text-foreground">{t.title}</h1>
        <p className="mt-1 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">{t.subtitle}</p>
      </div>

      <SubTabs active="employees" />

      {/* Barre d'outils : recherche + vue + ajout */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="h-10 w-full rounded-md border border-input bg-card pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
            aria-label={t.searchPlaceholder}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              aria-label={t.clearSearch}
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        {/* Bascule de vue */}
        <div className="flex items-center rounded-md border border-border p-0.5" role="group" aria-label="Vue">
          <button
            type="button"
            onClick={() => setView('team')}
            aria-pressed={view === 'team'}
            className={[
              'inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold',
              view === 'team' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            <Network className="size-3.5" aria-hidden />
            {t.viewByTeam}
          </button>
          <button
            type="button"
            onClick={() => setView('alpha')}
            aria-pressed={view === 'alpha'}
            className={[
              'inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold',
              view === 'alpha' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            <ArrowDownAZ className="size-3.5" aria-hidden />
            {t.viewAlpha}
          </button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="size-4" />
          <span className="whitespace-nowrap">{t.addEmployee}</span>
        </button>
      </div>

      {/* Filtres par type + compteurs */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-1">
          {(
            [
              ['all', t.filterAll],
              ['employe', t.filterEmployees],
              ['sous_traitant', t.filterSubcontractors],
            ] as [Filter, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={[
                'rounded-full border px-3 py-1 text-xs font-medium',
                filter === key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <Users className="size-3.5" aria-hidden />
            {t.peopleCount(totalPeople)}
          </span>
          {needInfoCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-attention-foreground">
              <TriangleAlert className="size-3.5" aria-hidden />
              {needInfoCount} {t.attention.toLowerCase()}
            </span>
          ) : null}
          {view === 'team' ? (
            <button
              type="button"
              onClick={() => setAll(!anyCollapsed)}
              className="inline-flex items-center gap-1.5 whitespace-nowrap font-medium hover:text-foreground"
            >
              {anyCollapsed ? <ChevronsUpDown className="size-3.5" /> : <ChevronsDownUp className="size-3.5" />}
              {anyCollapsed ? t.expandAll : t.collapseAll}
            </button>
          ) : null}
        </div>
      </div>

      {/* Contenu */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
          <Search className="size-7 text-muted-foreground" aria-hidden />
          <h2 className="mt-3 text-base font-semibold text-foreground">{t.emptyTitle}</h2>
          <p className="mt-1 max-w-sm text-pretty text-sm text-muted-foreground">{t.emptyBody}</p>
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mt-4 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary"
            >
              {t.clearSearch}
            </button>
          ) : null}
        </div>
      ) : view === 'team' ? (
        <div className="flex flex-col gap-3">
          {teams.map((team) => (
            <TeamGroup key={team.id} team={team} open={!collapsed[team.id]} onToggle={() => setCollapsed((c) => ({ ...c, [team.id]: !c[team.id] }))} />
          ))}

          {unassigned.length > 0 ? (
            <section className="overflow-hidden rounded-lg border border-attention/40 bg-card">
              <div className="flex items-start gap-3 border-b border-border bg-attention-muted/50 px-4 py-3">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-attention-foreground" aria-hidden />
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-foreground">
                    {t.unassignedTitle}{' '}
                    <span className="font-normal text-muted-foreground tnum">({unassigned.length})</span>
                  </h2>
                  <p className="mt-0.5 text-pretty text-xs text-muted-foreground">{t.unassignedHint}</p>
                </div>
              </div>
              <div className="px-3 py-1">
                {unassigned.map((m) => (
                  <EmployeeRow key={m.id} m={m} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card px-3 py-1">
          {allMembersAlpha.map((m) => (
            <EmployeeRow key={m.id} m={m} showLeadPath={m.path} />
          ))}
        </div>
      )}
    </AppShell>
  )
}
