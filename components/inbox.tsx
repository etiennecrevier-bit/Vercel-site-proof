'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, CornerDownLeft, Keyboard, Pencil } from 'lucide-react'
import { SUBMISSIONS, type Submission } from '@/lib/data'
import { LANGS, useI18n, type Lang } from '@/lib/i18n'
import { SubmissionRow } from '@/components/submission-row'
import { AllDoneState, EmptyState, ErrorState, LoadingState } from '@/components/inbox-states'

type Filter = 'process' | 'confirmed' | 'all'
type DemoState = 'data' | 'loading' | 'empty' | 'error'

const PENDING: Submission['state'][] = ['high', 'low', 'unrecognized']
const isPending = (s: Submission) => PENDING.includes(s.state)
const isDone = (s: Submission) => s.state === 'confirmed' || s.state === 'corrected'

export function Inbox() {
  const { t, lang, setLang } = useI18n()
  const [rows, setRows] = useState<Submission[]>(SUBMISSIONS)
  const [filter, setFilter] = useState<Filter>('process')
  const [demo, setDemo] = useState<DemoState>('data')
  const [selectedId, setSelectedId] = useState<string | null>(SUBMISSIONS.find(isPending)?.id ?? null)
  const [correctingId, setCorrectingId] = useState<string | null>(null)

  const counts = useMemo(() => {
    return {
      received: rows.length,
      toConfirm: rows.filter((s) => s.state === 'high').length,
      toCheck: rows.filter((s) => s.state === 'low' || s.state === 'unrecognized').length,
      confirmed: rows.filter(isDone).length,
    }
  }, [rows])

  const visible = useMemo(() => {
    if (filter === 'process') return rows.filter(isPending)
    if (filter === 'confirmed') return rows.filter(isDone)
    return rows
  }, [rows, filter])

  const confirm = useCallback((id: string) => {
    setRows((prev) => prev.map((s) => (s.id === id ? { ...s, state: 'confirmed' } : s)))
    setCorrectingId(null)
  }, [])

  const applyCorrect = useCallback((id: string, building: string) => {
    setRows((prev) => prev.map((s) => (s.id === id ? { ...s, state: 'corrected', correctedBuilding: building } : s)))
    setCorrectingId(null)
  }, [])

  const undo = useCallback((id: string) => {
    setRows((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s
        const base = SUBMISSIONS.find((o) => o.id === id)!
        return { ...s, state: base.state, correctedBuilding: base.correctedBuilding }
      }),
    )
  }, [])

  // Navigation clavier — pensé pour le geste répété
  useEffect(() => {
    if (demo !== 'data') return
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'SELECT' || tag === 'INPUT' || tag === 'TEXTAREA') return
      const list = visible
      if (list.length === 0) return
      const idx = list.findIndex((s) => s.id === selectedId)

      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault()
        const next = list[Math.min(idx + 1, list.length - 1)] ?? list[0]
        setSelectedId(next.id)
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = list[Math.max(idx - 1, 0)] ?? list[0]
        setSelectedId(prev.id)
      } else if (e.key === 'Enter' && idx >= 0 && isPending(list[idx])) {
        e.preventDefault()
        confirm(list[idx].id)
      } else if ((e.key === 'c' || e.key === 'C') && idx >= 0 && isPending(list[idx])) {
        e.preventDefault()
        setCorrectingId(list[idx].id)
      } else if (e.key === 'Escape') {
        setCorrectingId(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, selectedId, demo, confirm])

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'process', label: t.filterToProcess, count: counts.toConfirm + counts.toCheck },
    { key: 'confirmed', label: t.filterConfirmed, count: counts.confirmed },
    { key: 'all', label: t.filterAll, count: counts.received },
  ]

  const demoStates: { key: DemoState; label: string }[] = [
    { key: 'data', label: t.stateData },
    { key: 'loading', label: t.stateLoading },
    { key: 'empty', label: t.stateEmpty },
    { key: 'error', label: t.stateError },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
      {/* En-tête */}
      <header className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-3 pt-5 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span className="inline-block size-2 rounded-sm bg-primary" aria-hidden />
              {t.appName}
            </div>
            <h1 className="mt-1 text-pretty text-2xl font-bold tracking-tight text-foreground">{t.inboxTitle}</h1>
            <p className="tnum mt-0.5 text-sm text-muted-foreground">{t.dateToday}</p>
          </div>

          {/* Sélecteur de langue */}
          <div className="flex overflow-hidden rounded-md border border-border" role="group" aria-label="Langue">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code as Lang)}
                aria-pressed={lang === code}
                className={[
                  'px-2.5 py-1.5 text-sm font-semibold transition-colors',
                  lang === code ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Récapitulatif chiffré */}
        <dl className="mt-4 flex flex-wrap items-stretch gap-2">
          <Stat value={counts.received} label={t.received} tone="neutral" />
          <Stat value={counts.toConfirm} label={t.toConfirm} tone="neutral" />
          <Stat value={counts.toCheck} label={t.toCheck} tone="attention" />
          <Stat value={counts.confirmed} label={t.confirmed} tone="success" />
        </dl>

        {/* Barre d'outils : filtres + état de démo */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label={t.filterAll}>
            {filters.map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={[
                  'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  filter === f.key ? 'bg-secondary text-secondary-foreground ring-1 ring-border' : 'text-muted-foreground hover:bg-muted',
                ].join(' ')}
              >
                {f.label}
                <span
                  className={[
                    'tnum rounded px-1.5 py-0.5 text-xs',
                    filter === f.key ? 'bg-background text-foreground' : 'bg-muted text-muted-foreground',
                  ].join(' ')}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline">{t.state}</span>
            <span className="flex overflow-hidden rounded-md border border-border">
              {demoStates.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDemo(d.key)}
                  aria-pressed={demo === d.key}
                  className={[
                    'px-2 py-1 text-xs font-medium transition-colors',
                    demo === d.key ? 'bg-foreground text-background' : 'bg-card text-muted-foreground hover:bg-muted',
                  ].join(' ')}
                >
                  {d.label}
                </button>
              ))}
            </span>
          </label>
        </div>
      </header>

      {/* Aide clavier */}
      {demo === 'data' && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Keyboard className="size-3.5" aria-hidden />
            {t.keyboard}
          </span>
          <Hint keys={['J', 'K']} icon={<ArrowDown className="size-3" />} label={t.keyMove} />
          <Hint keys={['↵']} icon={<CornerDownLeft className="size-3" />} label={t.keyConfirm} />
          <Hint keys={['C']} icon={<Pencil className="size-3" />} label={t.keyCorrect} />
        </div>
      )}

      {/* Contenu */}
      <div className="mt-4">
        {demo === 'loading' ? (
          <LoadingState />
        ) : demo === 'error' ? (
          <ErrorState onRetry={() => setDemo('data')} />
        ) : demo === 'empty' ? (
          <EmptyState />
        ) : visible.length === 0 ? (
          filter === 'process' ? (
            <AllDoneState />
          ) : (
            <EmptyState />
          )
        ) : (
          <ul className="flex flex-col gap-3">
            {visible.map((s) => (
              <li key={s.id}>
                <SubmissionRow
                  submission={s}
                  selected={selectedId === s.id}
                  correcting={correctingId === s.id}
                  onSelect={() => setSelectedId(s.id)}
                  onConfirm={() => confirm(s.id)}
                  onStartCorrect={() => {
                    setSelectedId(s.id)
                    setCorrectingId(s.id)
                  }}
                  onApplyCorrect={(b) => applyCorrect(s.id, b)}
                  onCancelCorrect={() => setCorrectingId(null)}
                  onUndo={() => undo(s.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function Stat({ value, label, tone }: { value: number; label: string; tone: 'neutral' | 'attention' | 'success' }) {
  const toneClass =
    tone === 'attention'
      ? 'border-attention/40 bg-attention-muted'
      : tone === 'success'
        ? 'border-success/30 bg-success-muted'
        : 'border-border bg-card'
  const valueClass = tone === 'attention' ? 'text-attention-foreground' : tone === 'success' ? 'text-success-foreground' : 'text-foreground'
  return (
    <div className={['flex min-w-0 flex-1 basis-32 items-baseline gap-2 rounded-md border px-3 py-2', toneClass].join(' ')}>
      <dd className={['tnum text-2xl font-bold leading-none', valueClass].join(' ')}>{value}</dd>
      <dt className="text-pretty text-sm leading-tight text-muted-foreground">{label}</dt>
    </div>
  )
}

function Hint({ keys, icon, label }: { keys: string[]; icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex gap-1">
        {keys.map((k) => (
          <kbd
            key={k}
            className="tnum inline-flex min-w-5 items-center justify-center rounded border border-border bg-card px-1 py-0.5 font-mono text-[11px] font-medium text-foreground shadow-sm"
          >
            {k}
          </kbd>
        ))}
      </span>
      <span className="inline-flex items-center gap-1">
        <span className="text-muted-foreground/60" aria-hidden>
          {icon}
        </span>
        {label}
      </span>
    </span>
  )
}
