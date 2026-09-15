'use client'

import { useMemo, useState } from 'react'
import { Search, X, Plus, Building2, TriangleAlert } from 'lucide-react'
import { CLIENTS, type Building } from '@/lib/buildings-data'
import { useDir } from '@/lib/directory-i18n'
import { AppShell } from './app-shell'
import { SubTabs } from './sub-tabs'
import { BuildingCard } from './building-card'

type Filter = 'all' | 'active' | 'inactive' | 'missing'

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function bMatch(b: Building, q: string) {
  if (!q) return true
  return normalize([b.name, b.city, b.shortCode ?? '', ...b.aliases].join(' ')).includes(q)
}

function bPassesFilter(b: Building, filter: Filter) {
  if (filter === 'active') return b.active
  if (filter === 'inactive') return !b.active
  if (filter === 'missing') return b.shortCode === null
  return true
}

export function BuildingsDirectory() {
  const { t } = useDir()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const q = normalize(query.trim())

  const clients = useMemo(() => {
    return CLIENTS.map((c) => ({
      ...c,
      buildings: c.buildings.filter((b) => bMatch(b, q) && bPassesFilter(b, filter)),
    })).filter((c) => c.buildings.length > 0)
  }, [q, filter])

  const totalBuildings = CLIENTS.reduce((s, c) => s + c.buildings.length, 0)
  const toCode = CLIENTS.reduce((s, c) => s + c.buildings.filter((b) => b.shortCode === null).length, 0)
  const shown = clients.reduce((s, c) => s + c.buildings.length, 0)
  const isEmpty = shown === 0

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-pretty text-2xl font-bold tracking-tight text-foreground">{t.buildingsPageTitle}</h1>
        <p className="mt-1 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
          {t.buildingsPageSubtitle}
        </p>
      </div>

      <SubTabs active="buildings" />

      {/* Barre d'outils : recherche + ajout */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.bSearchPlaceholder}
            aria-label={t.bSearchPlaceholder}
            className="h-10 w-full rounded-md border border-input bg-card pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t.clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="size-4" />
          <span className="whitespace-nowrap">{t.addBuilding}</span>
        </button>
      </div>

      {/* Filtres + compteurs */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-1">
          {(
            [
              ['all', t.filterAll],
              ['active', t.filterActive],
              ['inactive', t.filterInactive],
              ['missing', t.filterMissingCode],
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
            <Building2 className="size-3.5" aria-hidden />
            {t.buildings(totalBuildings)}
          </span>
          {toCode > 0 ? (
            <button
              type="button"
              onClick={() => setFilter('missing')}
              className="inline-flex items-center gap-1.5 whitespace-nowrap font-medium text-attention-foreground hover:underline"
            >
              <TriangleAlert className="size-3.5" aria-hidden />
              {t.toCodeCount(toCode)}
            </button>
          ) : null}
        </div>
      </div>

      {/* Contenu */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
          <Search className="size-7 text-muted-foreground" aria-hidden />
          <h2 className="mt-3 text-base font-semibold text-foreground">{t.emptyTitle}</h2>
          <p className="mt-1 max-w-sm text-pretty text-sm text-muted-foreground">{t.bEmptyBody}</p>
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
      ) : (
        <div className="flex flex-col gap-3">
          {clients.map((c) => {
            const missing = c.buildings.filter((b) => b.shortCode === null).length
            return (
              <section key={c.id} className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border bg-secondary/50 px-4 py-2.5">
                  <h2 className="text-sm font-bold text-foreground">{c.name}</h2>
                  <span className="text-xs text-muted-foreground tnum">{t.buildings(c.buildings.length)}</span>
                  {missing > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-attention-foreground">
                      <TriangleAlert className="size-3" aria-hidden />
                      {t.toCodeCount(missing)}
                    </span>
                  ) : null}
                </div>
                <div className="divide-y divide-border">
                  {c.buildings.map((b) => (
                    <BuildingCard key={b.id} b={b} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </AppShell>
  )
}
