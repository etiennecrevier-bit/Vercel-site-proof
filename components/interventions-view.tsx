'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, Inbox, Search } from 'lucide-react'
import {
  CLIENTS,
  INTERVENTIONS,
  STATUS_META,
  TODAY,
  type Intervention,
  type InterventionStatus,
} from '@/lib/interventions'
import { InterventionCard } from '@/components/intervention-card'

type Scope = 'today' | 'week' | 'all'
type Triage = 'a-gerer' | 'envoye' | 'archive' | 'all'

const SCOPES: { key: Scope; label: string }[] = [
  { key: 'today', label: "Aujourd'hui" },
  { key: 'week', label: '7 jours' },
  { key: 'all', label: 'Tout' },
]

function daysBetween(a: string, b: string) {
  return Math.round((Date.parse(a) - Date.parse(b)) / 86_400_000)
}

function inScope(dateISO: string, scope: Scope) {
  if (scope === 'all') return true
  if (scope === 'today') return dateISO === TODAY
  const diff = daysBetween(TODAY, dateISO)
  return diff >= 0 && diff < 7
}

function formatDayHeader(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  const label = d.toLocaleDateString('fr-CA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const suffix = iso === TODAY ? " · aujourd'hui" : ''
  return label.charAt(0).toUpperCase() + label.slice(1) + suffix
}

export function InterventionsView() {
  const [rows, setRows] = useState<Intervention[]>(INTERVENTIONS)
  const [scope, setScope] = useState<Scope>('today')
  const [triage, setTriage] = useState<Triage>('a-gerer')
  const [client, setClient] = useState<string>('all')
  const [query, setQuery] = useState('')

  const onStatusChange = (id: string, next: InterventionStatus) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)))
  }

  // Périmètre de base : portée temporelle + client + recherche (avant filtre de triage)
  const scoped = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((r) => {
      if (!inScope(r.date, scope)) return false
      if (client !== 'all' && r.client !== client) return false
      if (!q) return true
      const hay = `${r.code ?? ''} ${r.site} ${r.client} ${r.city} ${r.technician}`.toLowerCase()
      return hay.includes(q)
    })
  }, [rows, scope, client, query])

  const counts = useMemo(() => {
    const c = { 'a-gerer': 0, envoye: 0, archive: 0 }
    for (const r of scoped) c[STATUS_META[r.status].group]++
    return c
  }, [scoped])

  const visible = useMemo(() => {
    const list = triage === 'all' ? scoped : scoped.filter((r) => STATUS_META[r.status].group === triage)
    return [...list].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  }, [scoped, triage])

  // Regroupement par jour
  const groups = useMemo(() => {
    const map = new Map<string, Intervention[]>()
    for (const r of visible) {
      const arr = map.get(r.date) ?? []
      arr.push(r)
      map.set(r.date, arr)
    }
    return Array.from(map.entries())
  }, [visible])

  const triageTabs: { key: Triage; label: string; count: number; tone: 'attention' | 'neutral' }[] = [
    { key: 'a-gerer', label: 'À gérer', count: counts['a-gerer'], tone: 'attention' },
    { key: 'envoye', label: 'Envoyés', count: counts.envoye, tone: 'neutral' },
    { key: 'archive', label: 'Archivés', count: counts.archive, tone: 'neutral' },
    { key: 'all', label: 'Tout', count: scoped.length, tone: 'neutral' },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
      {/* En-tête */}
      <header className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-3 pt-5 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span className="inline-block size-2 rounded-sm bg-primary" aria-hidden />
              Site Proof
            </div>
            <h1 className="mt-1 text-pretty text-2xl font-bold tracking-tight text-foreground">Journal des interventions</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Chaque visite, ses preuves photo et le suivi de son statut.</p>
          </div>

          {/* Portée temporelle */}
          <div className="flex overflow-hidden rounded-md border border-border" role="group" aria-label="Période">
            {SCOPES.map((s) => (
              <button
                key={s.key}
                onClick={() => setScope(s.key)}
                aria-pressed={scope === s.key}
                className={[
                  'px-3 py-1.5 text-sm font-semibold transition-colors',
                  scope === s.key ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted',
                ].join(' ')}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Triage par statut */}
        <div className="mt-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Triage">
          {triageTabs.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={triage === f.key}
              onClick={() => setTriage(f.key)}
              className={[
                'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                triage === f.key ? 'bg-secondary text-secondary-foreground ring-1 ring-border' : 'text-muted-foreground hover:bg-muted',
              ].join(' ')}
            >
              {f.label}
              <span
                className={[
                  'tnum rounded px-1.5 py-0.5 text-xs',
                  f.tone === 'attention' && f.count > 0
                    ? 'bg-attention-muted text-attention-foreground'
                    : triage === f.key
                      ? 'bg-background text-foreground'
                      : 'bg-muted text-muted-foreground',
                ].join(' ')}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Recherche + client */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1 basis-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un site, un code, un client ou un technicien"
              className="w-full rounded-md border border-input bg-card py-2 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <select
            value={client}
            onChange={(e) => setClient(e.target.value)}
            aria-label="Filtrer par client"
            className="rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">Tous les clients</option>
            {CLIENTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Bandeau « à gérer » — la file de travail */}
      {counts['a-gerer'] > 0 && triage !== 'a-gerer' && (
        <button
          onClick={() => setTriage('a-gerer')}
          className="mt-4 flex w-full items-center gap-3 rounded-md border border-attention/40 bg-attention-muted px-4 py-2.5 text-left text-sm text-attention-foreground transition-colors hover:brightness-[0.98]"
        >
          <span className="tnum text-lg font-bold leading-none">{counts['a-gerer']}</span>
          <span className="font-medium">
            intervention{counts['a-gerer'] > 1 ? 's' : ''} à gérer sur cette période — cliquer pour n'afficher qu'elles
          </span>
        </button>
      )}

      {/* Liste groupée par jour */}
      <div className="mt-4">
        {groups.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-6">
            {groups.map(([date, items]) => (
              <section key={date}>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CalendarDays className="size-4 text-muted-foreground" aria-hidden />
                  {formatDayHeader(date)}
                  <span className="tnum rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <ul className="flex flex-col gap-3">
                  {items.map((iv) => (
                    <li key={iv.id}>
                      <InterventionCard intervention={iv} onStatusChange={onStatusChange} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
      <Inbox className="size-8 text-muted-foreground" aria-hidden />
      <h2 className="mt-3 text-base font-semibold text-foreground">Aucune intervention</h2>
      <p className="mt-1 max-w-sm text-pretty text-sm text-muted-foreground">
        Aucune intervention ne correspond à cette période et à ce filtre. Élargissez la portée ou changez de triage.
      </p>
    </div>
  )
}
